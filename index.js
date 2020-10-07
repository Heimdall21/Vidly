const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const express = require('express');
const middleware = require('./middleware');
const { countReset } = require('console');
const helmet = require('helmet');
const morgan = require('morgan');
const { env } = require('process');
const mongoose = require('mongoose');

const home = require('./routes/home');
const rentals = require('./routes/rentals');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(middleware.logger);
app.use(middleware.authenticator);
app.use(helmet());

app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('./api/rentals', rentals);
app.use('./api/movies', movies);


// MongoDB stuff
// 1. Connect to database
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB Vidly genres'))
    .catch(err => console.error('Could not connect to MongoDB Vidly genres: ', err));

// Debug settings
dbDebugger('Connected to the database ...');

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
//console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //console.log('Morgan enabled ...');
    startupDebugger('Morgan enabled ...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));