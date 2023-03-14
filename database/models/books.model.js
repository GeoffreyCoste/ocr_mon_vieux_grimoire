const mongoose = require('mongoose');

const booksSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    ratings: [{
        userId: {
            type: String,
            required: true,
            /* unique: true */ // Use unique ?
        },
        grade: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        }
    }, ],
    averageRating: {
        type: Number,
        default: function () {
            return Math.round(this.ratings.reduce((acc, rating) => acc + rating.grade, 0) / this.ratings.length);
        }
    }
});


booksSchema.post('findOneAndUpdate', function (result) {
    result.averageRating = Math.round(result.ratings.reduce((acc, rating) => acc + rating.grade, 0) / result.ratings.length);
    result.save();
});

module.exports = mongoose.model('Books', booksSchema);