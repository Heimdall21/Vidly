const Joi = require('joi');     // Joi is a class 
const mongoose = require('mongoose');

// 2. Define data variable schema which gives a class
const genreSchema = new mongoose.Schema({
    id: Number,
    name: String,
    date: {type: Date, default: Date.now}
})

// 3. Create a model using class
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre (genre) {
    console.log("this is the genre input: ", genre);
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(genre, schema); 
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
