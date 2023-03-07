const express = require('express');
const router = express.Router();
const authVerify = require('../middlewares/authVerify');
const multerConfig = require('../middlewares/multerConfig');
const {
    bookCreate,
    bookUpdate,
    bookDelete,
    bookBestRating,
    bookAddRating,
    bookGetOne,
    booksAll,
} = require('../controllers/books.controller');


router.post('/', authVerify, multerConfig, bookCreate);
router.get('/bestrating', bookBestRating);
router.post('/:id/rating', authVerify, bookAddRating);
router.get('/:id', bookGetOne);
router.get('/', booksAll);
router.put('/:id', authVerify, multerConfig, bookUpdate);
router.delete('/:id', authVerify, bookDelete);

module.exports = router;