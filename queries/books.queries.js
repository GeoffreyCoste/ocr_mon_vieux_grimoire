const fs = require('fs');
const Books = require('../database/models/books.model');

exports.createNewBook = (id, body, url) => {
    const bookObj = JSON.parse(body.book);
    delete bookObj._id;
    delete bookObj.userId;
    const book = new Books({
        ...bookObj,
        userId: id,
        imageUrl: url
    });
    return book.save();
}

exports.updateBook = async (id, userId, body) => {
    try {
        const book = await Books.findOne({
            _id: id
        });
        if (book && book.userId == userId) {
            if (!body.imageUrl) {
                return Books.updateOne({
                    _id: id
                }, {
                    ...body,
                    _id: id
                });
            } else {
                const filename = book.imageUrl.split('/public/images/')[1];
                fs.unlinkSync(`public/images/${filename}`);
                await Books.updateOne({
                    _id: id
                }, {
                    ...body,
                    _id: id
                });
                return;
            }
        } else {
            throw Error('Book update failed');
        }
    } catch (error) {
        throw ({
            message: 'Book update failed'
        });
    }
}

exports.deleteBook = async (id, userId) => {
    try {
        const book = await Books.findOne({
            _id: id
        });
        if (book && book.userId == userId) {
            const filename = book.imageUrl.split('/public/images/')[1];
            fs.unlink(`public/images/${filename}`, async () => {
                await Books.deleteOne({
                    _id: id
                });
            });
        } else {
            throw Error();
        }
    } catch (error) {
        throw ({
            message: 'Book deletion failed'
        });
    }
}

exports.addNewRating = async (id, userId, body) => {
    try {
        const book = await Books.findOneAndUpdate({
            _id: id,
            "ratings.userId": {
                $ne: userId
            }
        }, {
            $push: {
                "ratings": {
                    "userId": userId,
                    "grade": body.rating
                }
            },
        }, {
            new: true
        }).exec();
        return book;
    } catch (error) {
        throw ({
            message: 'Rating update failed'
        });
    }
}

exports.getBestRatings = () => {
    return Books.find({}).sort({
        averageRating: -1
    }).limit(3);
}

exports.getBook = (id) => {
    return Books.findOne({
        _id: id
    }).exec();
}

exports.getAllBooks = () => {
    return Books.find().exec();
}