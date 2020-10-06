const express = require('express');
const home = express.Router();

home.get('/', (req, res) => {
    res.render('index', { title: 'My Express App', message: 'Vidly coming soon!' });
});

module.exports = home;