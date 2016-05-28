'use strict';

var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var worker = require('../modules/worker');
var GalleryPic = require('../models/gallerypic');

module.exports = function (app) {
    app.delete("/images/:id", function (req, res, next) {
	console.log("worker.remove(id): " + req.params.id);

        worker.remove(req.params.id, function() {
            res.end('');
        })
    });

    app.post("/images/:id?", upload.single('profilepic'), function (req, res, next) {
        req.body.file = req.file;

        worker.addToQueue(req.body, function () {
            res.redirect('/');
        });
    });
};
