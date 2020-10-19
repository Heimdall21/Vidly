const Joi = require('joi');
const mongoose = require('mongoose');

// schema
const rentalSchema = mongoose.Schema({
    customer: {
        type: new mongoose.Schema({         // we're creating a new schema and not importing, because we want a filtered set of customer details that only this rental object needs
            name: {
                type: String, 
                required: true,
                minLength: 5,
                maxLength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minLength: 5, 
                maxLength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String, 
                required: true,
                trim: true,
                minLength: 5,
                maxLength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: String, 
        required: true, 
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number, 
        min: 0,
    },
    isOverdue: Boolean,     // if overdue, include the overdue penalty
})

// model
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental (movie) {
    //console.log("this is the genre input: ", genre);
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    }
    return Joi.validate(movie, schema); 
}

exports.Rental = Rental;
exports.validate = validateRental;