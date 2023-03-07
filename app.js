const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config();
const router = require('./routes');

const DB_CONNECTION = process.env.DB_CONNECTION;

const app = express();

app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect(DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to MongoDB database.'))
    .catch((error) => console.log('Connection to MongoDB database failed: ', error));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(router);
app.use('/images/', express.static(path.join(__dirname, 'images')));

module.exports = app;