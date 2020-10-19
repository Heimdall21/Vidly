const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
    // MongoDB stuff
// 1. Connect to database
    mongoose.connect('mongodb://localhost/vidly')
        //.then(() => console.log('Connected to MongoDB Vidly'))
        .then(() => winston.info('Connected to MongoDB Vidly'))
        //.catch(err => console.error('Could not connect to MongoDB Vidly: ', err));
}


