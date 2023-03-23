const {
    createNewBook,
    updateBook,
    deleteBook,
    getBestRatings,
    addNewRating,
    getBook,
    getAllBooks,
} = require('../queries/books.queries');
const logger = require('../utils/logger');


exports.bookCreate = async (req, res, next) => {
    try {
        if (!req.body || !req.file) {
            logger.log('error', 'Book creation failed, mandatory infos missing', {
                request: {
                    method: req.method,
                    path: req.url
                },
                response: {
                    status: 400
                },
            });
            throw ({
                message: 'Book creation failed, mandatory infos missing'
            })
        }
        const id = req.auth.userId;
        const url = `${req.protocol}://${req.get('host')}/public/images/${req.file.filename}`;
        const body = req.body;
        const newBook = await createNewBook(id, body, url);
        logger.log('info', 'New book created');
        res.status(201).json({
            message: 'New book created'
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

exports.bookUpdate = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.auth.userId;
        const body = req.file ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/public/images/${req.file.filename}`
        } : {
            ...req.body
        }
        await updateBook(id, userId, body);
        logger.log('info', 'Book updated');
        res.status(200).json({
            message: 'Book updated'
        });
    } catch (error) {
        res.status(401).json({
            error
        });
    }
}

exports.bookDelete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.auth.userId;
        await deleteBook(id, userId);
        logger.log('info', 'Book deleted');
        res.status(200).json({
            message: 'Book deleted'
        });
    } catch (error) {
        logger.log('error', 'Book deletion failed', {
            request: {
                method: req.method,
                path: req.url
            },
            response: {
                status: 500
            }
        })
        res.status(500).json({
            error
        })
    }
}

exports.bookBestRating = async (req, res, next) => {
    try {
        const topThree = await getBestRatings();
        if (!topThree) {
            logger.log('error', 'Books best rating request failed', {
                request: {
                    method: req.method,
                    path: req.url
                },
                response: {
                    status: 400
                }
            });
            throw ({
                message: 'Books best rating request failed'
            })
        } else {
            res.status(200).json(topThree);
        }
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};

exports.bookAddRating = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.auth.userId;
        const body = req.body;
        const updatedBook = await addNewRating(id, userId, body);
        logger.log('info', 'Book updated');
        res.status(201).json(updatedBook);
    } catch (error) {
        logger.log('error', 'Book update failed', {
            request: {
                method: req.method,
                path: req.url
            },
            response: {
                status: 500
            }
        })
        res.status(500).json({
            error
        });
    }
};

exports.bookGetOne = async (req, res, next) => {
    try {
        const id = req.params.id;
        const book = await getBook(id);
        if (!book) {
            logger.log('error', 'Book not found');
            throw ({
                message: 'Book not found'
            })
        } else {
            res.status(200).json(book);
        }
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

exports.booksAll = async (req, res, next) => {
    try {
        const books = await getAllBooks();
        if (!books) {
            logger.log('error', 'Books request failed', {
                request: {
                    method: req.method,
                    path: req.url
                },
                response: {
                    status: 400
                }
            });
            throw ({
                message: 'Books request failed'
            })
        } else {
            res.status(200).json(books);
        }
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}