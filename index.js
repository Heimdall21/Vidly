const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const express = require('express');
const middleware = require('./middleware');
const { countReset } = require('console');
const helmet = require('helmet');
const morgan = require('morgan');
const { env } = require('process');
const winston = require('winston');

const app = express();
//require('./startup/logging')();
require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

app.use(middleware.logger);
app.use(middleware.authenticator);
app.use(helmet());

app.set('view engine', 'pug');
app.set('views', './views');

// Debug settings
dbDebugger('Connected to the database ...');

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //console.log('Morgan enabled ...');
    startupDebugger('Morgan enabled ...');
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;