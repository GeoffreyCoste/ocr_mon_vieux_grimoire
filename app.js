const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

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


module.exports = app;