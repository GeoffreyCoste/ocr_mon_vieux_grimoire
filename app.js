const express = require('express');
const path = require('path');
const fs = require('fs');
const router = require('./routes');
const morgan = require('morgan');
require('./database'); // import mongoose client promise

const app = express();

const writeLogStream = fs.createWriteStream(path.join(__dirname, 'errors.log'), {
    flags: 'a'
}); // 'a' = append, 'w' = write (cf. fs.open documentation)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: writeLogStream
}));

app.use('/public/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api', router);

module.exports = app;