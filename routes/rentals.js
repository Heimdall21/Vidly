const { Rental , validate } = require('../models/rental');
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const auth = require('../middleware/auth');

const { Customer } = require('../models/customer');
const {Movie } = require('../models/movie');

const router = express.Router();

Fawn.init(mongoose);

// Create a new Rental 
// POST /api/rental

// get list of rentals
// GET /api/rentals


// return all rental info
router.get('/', auth, async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');       // this is sorting by "dateOut" in descending order
    res.send(rentals);
}) 

// return by rental id
router.get('/:id', auth, async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    // don't forget to do error handling!
    if (!rental) return res.status(404).send('The rental with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(rental);
}) 

router.put('/:id', auth, async (req, res) => {
    const rental = await Rental.findByIdAndUpdate(req.params.id, {
        dateBorrowed: req.body.dateBorrowed,
        dateDue: req.body.dateDue,
        isOverdue: req.body.isOverdue,
        rentalPrice: req.body.rentalPrice,
    }, { new: true });

    if (!rental) return res.status(404).send('The rental with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(rental);
})

router.post('/', auth, async (req, res) => {
    // validate the request
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get the customer details using the input customerId
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    // get the genre details usign the requested input genreId
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid genre');

    // create a rental object and save
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    /* rental = await rental.save();
    movie.numberInStock--;
    movie.save();
    res.send(rental); */
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id}, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(rental);
    }
    catch (ex){
        res.status(500).send("Internal server error");
    }  
})

router.delete('/:id', auth, async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given id was not found'); // 404 - object not found - convention of RESTful API

    res.send(rental);
})


module.exports = router;

