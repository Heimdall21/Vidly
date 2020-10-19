const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const currentUser = await User.findById(req.user._id).select('-password');
    res.send(currentUser);
})

router.post('/', async (req, res) => {
    // check that the request is valid
    const { error } = validate(req.body);
    if(error) return res.status(400).send('Incorrect account details');

    // check for identical email/account
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('Email already registered');

    // post
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(user.password, salt);
    user.password = hashed;
    
    await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = router;




