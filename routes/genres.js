const { Genre, validate } = require('../models/genre');
const express = require('express');
const Joi = require('joi');     // Joi is a class 
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();


// Express Endpoints

// endpoint no.1
router.get('/', asyncMiddleware(async (req, res) => {       // removed the "auth" middleware
    //throw new Error('Could not get the genres');
    const genres = await Genre.find().sort('name');  
    res.send(genres);  
}));

// endpoint no.2
router.get('/:id', validateObjectId, async (req, res) => { 

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(genre);
})

// this is yet another endpoint
router.post('/', auth, asyncMiddleware(async (req, res) => {   
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);      // 400 Bad Request

    let genre = new Genre({ name: req.body.name });
    console.log(genre);
    genre = await genre.save();

    // 2. Send to website
    res.send(genre);
}))


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