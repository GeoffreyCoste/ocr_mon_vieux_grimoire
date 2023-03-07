const express = require('express');
const router = express.Router();
const user = require('./user.routes');
const books = require('./books.routes');

router.use('/api/auth', user);
router.use('/api/books', books);

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the API'
    });
});

module.exports = router;