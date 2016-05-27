// Dependencies
var express = require('express');
var router = express.Router();

// Models
var Product = require('../models/gallerypic');

// Routes
Product.methods(['get', 'put', 'post', 'delete']);
Product.register(router, '/gallerypics');

// Return router
module.exports = router;
