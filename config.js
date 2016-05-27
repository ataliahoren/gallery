'use strict';

var config = {
    awsKey: '',
    awsSecret: '',
    s3Bucket: '',

    cloudinaryKey: '',
    cloudinarySecret: '',

    redisHost: '',

    mongooseUri: ''
};

module.exports = require('rc')('photoGallery', config);