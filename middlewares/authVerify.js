const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Remove 'Bearer' and only get token
        const decodedToken = jwt.verify(token, SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({
            error
        })
    }
}