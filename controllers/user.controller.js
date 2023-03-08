const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const {
    createUser,
    findUserPerEmail
} = require('../queries/user.queries');

const SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;


exports.signup = async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Email and password required"
        });
    }
    try {
        const body = req.body;
        const user = await createUser(body);
        res.status(201).json({
            message: 'User created'
        });
    } catch (error) {
        res.status(500).json({
            message: 'User account creation failed'
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;
        const user = await findUserPerEmail(email);
        if (user) {
            const match = await user.comparePassword(password);
            if (match) {
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign({
                            userId: user._id
                        },
                        SECRET, {
                            expiresIn: JWT_EXPIRES_IN
                        }
                    )
                })
            } else {
                res.status(401).json({
                    message: 'Invalid email and/or password'
                })
            }
        } else {
            res.status(404).json({
                message: 'User not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        });
    }
};