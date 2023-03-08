const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        /* const extension = MIME_TYPES[file.mimetype]; */ // Extension seems to be provided with 'filename'
        callback(null, Date.now() + '_' + name);
    }
});

module.exports = multer({
    storage: storage
}).single('image');