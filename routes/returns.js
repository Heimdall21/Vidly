const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const moment = require('moment');

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('customerID not provided');

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });
    if(!rental) return res.status(404).send('rental does not exist');

    if(rental.dateReturned) return res.status(400).send('return already rented');

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');

    if (rentalDays) rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

    await rental.save();

    await Movie.update({ _id: rental.movie._id }, { 
        $inc: { numberInStock: 1 }
    });

    return res.status(200).send(rental);
});


module.exports = router;