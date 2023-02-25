const express = require('express');
const router = express.Router();
const user = require('./user.routes');

router.use('/api/auth', user);

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the API'
    });
});

module.exports = router;