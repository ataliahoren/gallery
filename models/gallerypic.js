// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var GallerySchema = new mongoose.Schema({
        id: String,
        name: String,
        description: String,
	dominateColor: String,
        originalImage: String,
        smallImage: String,
        mediumImage: String,
        largeImage: String,
    },
    {collection: 'pictures'});

// Return model
module.exports = restful.model('Gallerypics', GallerySchema);
