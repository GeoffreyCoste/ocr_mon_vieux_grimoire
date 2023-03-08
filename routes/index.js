const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocs = yaml.load('swagger.yaml');
const user = require('./user.routes');
const books = require('./books.routes');

router.use('/auth', user);
router.use('/books', books);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

router.get('/', (req, res) => {
    res.status(200).render('home');
});

module.exports = router;