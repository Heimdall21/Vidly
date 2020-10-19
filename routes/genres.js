const { Genre, validate } = require('../models/genre');
const express = require('express');
const Joi = require('joi');     // Joi is a class 
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();


// MongoDB functions: Create, Retrieve, Update, Delete data
async function retrieveGenre() {
    console.log("inside retrieveGenre: ");
    const genres = await Genre.find();      // how does .find() work exactly?
    console.log("Retrieved genres: ", genres);
    return genres;
}


// Code cleaning functions
function spliceGenreData(genres) {
    var cleanedGenres = []
    for (var i = 0; i < genres.length; i++) {
        cleanedGenres.push(genres[i]._doc);
    }
    return cleanedGenres;
}


// Express Endpoints

// endpoint no.1
router.get('/', auth, async (req, res) => {
    // 1. Retrieve all documents
    // 2. send it
    const genres = await retrieveGenre();
    const cleanedGenres = spliceGenreData(genres);   // doesn't require a promise, so won't use await - this is what I'm thinking

    res.send(cleanedGenres);
});

// endpoint no.2
router.get('/:id', async (req, res) => { 
    // 1. Retrieve correct id'd documented
    //const genre = await retrieveGenreById(req.params.id);
    const genre = await Genre.findById(req.params.id);

    console.log("Genre by Id is: ", genre);
    
    if (!genre) return res.status(404).send('The genre with the given id was not found'); // 404 - object not found - convention of RESTful API

    // 2. send to the website
    res.send(genre);
})

// this is yet another endpoint
router.post('/', auth, async (req, res) => {   // ???
    
  
    //const { error } = validate(req.body); 
    //if (error) return res.status(400).send(error.details[0].message);      // 400 Bad Request

    let genre = new Genre({ name: req.body.name });
    console.log(genre);
    genre = await genre.save();


    // 2. Send to website
    res.send(genre);
    
})


// this is a unique route end - for replacing data
router.put('/:id', auth, async (req, res) => {

    // validate
    // if invalid request, return 400 - Bad Request
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);   // 400 Bad Request

    // look up course
    // if it doesn't exist, return 404
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
        new: true
    });

    if (!genre) return res.status(404).send('The genre with the given ID was not found'); // 404 - object not found - convention of RESTful API

    // update the course
    // return the updated course
    
    res.send(genre);
})


router.delete('/:id', [auth, admin], async (req, res) => {

    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found');   // return immediately if this IF block does get triggered - don't continue

    res.send(genre);
})


module.exports = router;