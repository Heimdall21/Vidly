const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const _ = require('lodash');
const Joi = require('joi');

const router = express.Router();


router.post('/', async (req, res) => {
    // check that the request is valid
    const { error } = validate(req.body);
    if(error) return res.status(400).send('Incorrect account details');

    // check for identical email/account
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email or password not valid');

    // compare the password submitted
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email or password not valid');

    const token = user.generateAuthToken();
    
    res.send(token);
})


function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    }
    return Joi.validate(req, schema); 
}


module.exports = router;




