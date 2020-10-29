const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    // MongoDB stuff
    // 1. Connect to database
    const db = config.get('db');
    mongoose.connect(db)
        //.then(() => console.log('Connected to MongoDB Vidly'))
        .then(() => winston.info(`Connected to ${db}`))
        //.catch(err => console.error('Could not connect to MongoDB Vidly: ', err));
}


