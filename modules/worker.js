'use strict';

// S3 bucket
var AWS = require('aws-sdk');
var path = require('path');
var async = require('async');
var http = require('http');
var fs = require('fs');
var uuid = require('uuid');
var config = require('../config');
var GalleryPic = require('../models/gallerypic');

AWS.config.update({accessKeyId: config.awsKey, secretAccessKey: config.awsSecret});

var s3 = new AWS.S3({params: {Bucket: config.s3Bucket}});

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'gallerypicss3',
    api_key: config.cloudinaryKey,
    api_secret: config.cloudinarySecret
});

function remove(id, callback) {
    console.log("id to remove: " + id);
    GalleryPic.findOne(id).then(function (obj) {
        console.log(obj);
        var imagesKeys = ['original', 'small', 'medium', 'large'].map(function (type) {
            return {
                Key: obj[type + 'Image'].split('aws.com/')[1]
            };
        });
        var params = {
            Delete: { // required
                Objects: imagesKeys
            }
        };
        s3.deleteObjects(params, function (err, res) {
            console.log(err, res);
            obj.remove().then(function(res) {
                callback(null);
            }, function(err) {
                callback(err);
            });
        })
    }, function(err) {
        callback(err)
    });
}

function rundown(item, callback) {
    // Upload the image to cloudinary
    cloudinary.uploader.upload(item.data.file.path, function (result) {
        var files = [{
            url: result.url,
            type: 'original'
        }, {
            url: cloudinary.url(result.public_id, {width: 100, height: 100, crop: 'fit'}),
            type: 'small'
        }, {
            url: cloudinary.url(result.public_id, {width: 500, height: 500, crop: 'fit'}),
            type: 'medium'
        }, {
            url: cloudinary.url(result.public_id, {width: 1000, height: 1000, crop: 'fit'}),
            type: 'large'
        }];

        // get from cloudinary the metadata (dominant color)
        cloudinary.api.resource(result.public_id, function (result) {
            var color = '';
            try {
                color = result.predominant.google[0][0];
            } catch (e) {
            }

            async.map(files, function (file, callback) {
                var key = [item.s3Key, '_', file.type, item.extension].join('');

                http.get(file.url, function (res) {
                    if (res.statusCode !== 200) return;

                    var params = {
                        Key: key,
                        Body: res,
                        ContentType: res.headers['content-type'],
                        ACL: 'public-read'
                    };

                    s3.upload(params, (err, obj) => {
                        console.log(obj.Location);
                        file.url = obj.Location;
                        callback(null, file);
                    });
                });
            }, function (err, files) {
                console.log(files);

                fs.unlink(item.data.file.path, function (err, res) {

                    var obj = {
                        name: item.data.name,
                        dominateColor: color,
                        description: item.data.description
                    };
                    files.forEach(function (file) {
                        obj[file.type + 'Image'] = file.url;
                    });

                    console.log(obj);


                    var pic = new GalleryPic(obj);
                    pic.save().then(function (obj) {
                        console.log(obj);
                        callback(null, obj);
                    });
                });
            });

        }, {colors: true});
    });
}

module.exports.addToQueue = function (obj, callback) {
    rundown({
        s3Key: "images/" + uuid.v4(),
        extension: path.extname(obj.file.originalname),
        data: obj
    }, callback);
};

module.exports.remove = remove;
