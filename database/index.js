const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const DB_CONNECTION = process.env.DB_CONNECTION;

mongoose.set("strictQuery", false);

exports.clientPromise = mongoose.connect(DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to MongoDB database.'))
    .catch((error) => console.log('Connection to MongoDB database failed: ', error));