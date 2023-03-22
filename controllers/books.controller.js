const {
    createNewBook,
    updateBook,
    deleteBook,
    getBestRatings,
    addNewRating,
    getBook,
    getAllBooks,
} = require('../queries/books.queries');


exports.bookCreate = async (req, res, next) => {
    try {
        if (!req.body || !req.file) {
            throw ({
                message: 'Book creation failed, mandatory infos missing'
            })
        }
        const id = req.auth.userId;
        const url = `${req.protocol}://${req.get('host')}/public/images/${req.file.filename}`;
        const body = req.body;
        const newBook = await createNewBook(id, body, url);
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
        res.status(200).json({
            message: 'Book deleted'
        });
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

exports.bookBestRating = async (req, res, next) => {
    try {
        const topThree = await getBestRatings();
        if (!topThree) {
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
        res.status(201).json(updatedBook);
    } catch (error) {
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