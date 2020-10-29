const winston = require('winston');     // logger object
//require('winston-mongodb');

module.exports = function() {
    winston.handleExceptions(new winston.transports.File({ filename: 'uncaughtExceptions.log'}));

    winston.add(new winston.transports.File({ filename: 'logfile.log'}));
    /* winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' })); */ //  149 logging errors to mongodb

    process.on('uncaughtException', (ex) => {
        console.log('WE GOT AN UNCAUGHT EXCEPTION');
        winston.error(ex.message, ex);
    })
}