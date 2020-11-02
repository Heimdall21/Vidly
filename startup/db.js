const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://1234:1234@cluster0.w6z7c.mongodb.net/<dbname>?retryWrites=true&w=majority";

/* module.exports = function () {
    const client = new MongoClient(uri, { useNewUrlParser: true});

    client.connect(err => {
        const collection = client.db("test").collection("devices");
        client.close();
    })
} */


module.exports = function() {
    // MongoDB stuff
    // 1. Connect to database
    const db = config.get('db');
    mongoose.connect(db)
        //.then(() => console.log('Connected to MongoDB Vidly'))
        .then(() => winston.info(`Connected to ${db}`))
        //.catch(err => console.error('Could not connect to MongoDB Vidly: ', err));
}






