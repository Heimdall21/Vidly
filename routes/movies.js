const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();


// 3. Movie endpoint functions

// return all movie info
router.get('/', auth, async (req, res) => {
    console.log("Movies: inside the GET function");
    const movies = await Movie.find();
    res.send(movies);
}) 

// return by movie id
router.get('/:id', [auth, admin], async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    // don't forget to do error handling!
    if (!movie) return res.status(404).send('The movie with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(movie);
})  
/* 
router.put('/:id', async (req, res) => {

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            id: req.body.genre.id,
            name: req.body.genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

    if (!movie) return res.status(404).send('The movie with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(movie);
}) */

router.post('/', auth, async (req, res) => {
    console.log("Movies: inside the post function");
    
    const { error } = validate(req.body);   // checking the input format provided by customer
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);       // REMEMBER! The customer is sending the genreID as input, not the genre itself!
    if (!genre) return res.status(400).send('Invalid genre');


    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save();

    res.send(movie); 
})

/* router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(movie);
}) */

// create movie
// update author


module.exports = router;

