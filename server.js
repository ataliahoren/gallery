// call the packages we need
// Dependencies
var express = require('express');
var fs = require('fs');
var Log = require('log'),
    log = new Log('debug', fs.createWriteStream('my.log'));
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var restify = require('restify');
var moment = require('moment');
var redis = require('redis');
var config = require('./config');
var app = express();
var port = process.env.PORT || 8080;


// redis
var server = restify.createServer();
server.use(restify.queryParser());
var redisClient = redis.createClient({
    host: config.redisHost,
    no_ready_check: true,
    port: 13069
});

// Express
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

// MongoDB
mongoose.connect(config.mongooseUri);

// Routes MongoDB
app.use('/api', require('./routes/api'));

require('./routes/images')(app);

// Start server
app.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
});