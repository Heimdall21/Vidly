const { Movie, validate } = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();


// 3. Movie endpoint functions

// return all movie info
router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
}) 

// return by customer id
router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    // don't forget to do error handling!
    if (!movie) return res.status(404).send('The movie with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(movie);
}) 

router.put('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

    if (!movie) return res.status(404).send('The movie with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(movie);
})

router.post('/', async (req, res) => {
    // 
    let movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    movie = await movie.save();

    res.send(movie);
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(movie);
})



module.exports = router;

