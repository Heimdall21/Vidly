const Joi = require('joi'); 
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    isGold: Boolean,
    name: String,
    phone: String
})

// 2. model
const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer (customer) {
    console.log("this is the genre input: ", genre);
    const schema = {
        name: Joi.string().min(5).max(5).required(),
        phone: Joi.string().min(5).max(5).required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(customer, schema); 
}

exports.Customer = Customer;
exports.validate = validateCustomer;