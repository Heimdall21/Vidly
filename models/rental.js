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
                required: true
            },
            phone: {
                type: String,
                required: true,
                minLength: 5, 
                maxLength: 50
            }
        })
    },
    dateOut: {
        type: String, 
        required: true, 
        default: Date.now
    },
    dateDue: {
        type: String
    },
    rentalFee: {
        type: Number, 
        min: 0,
        required: true
    },
    isOverdue: Boolean,     // if overdue, include the overdue penalty
})

// model
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental (movie) {
    console.log("this is the genre input: ", genre);
    const schema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
    }
    return Joi.validate(movie, schema); 
}

exports.Rental = Rental;
exports.validate = validateRental;