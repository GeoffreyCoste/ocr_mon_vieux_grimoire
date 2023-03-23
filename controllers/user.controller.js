const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const {
    createUser,
    findUserPerEmail
} = require('../queries/user.queries');
const logger = require('../utils/logger');

const SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

exports.signup = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            logger.log('error', 'Email and password required', {
                request: {
                    method: req.method,
                    path: req.url
                },
                response: {
                    status: 400
                },
            });
            return res.status(400).send({
                message: "Email and password required"
            });
        }
        const body = req.body;
        const user = await createUser(body);
        if (!user) {
            logger.log('error', 'This email address is already registered', {
                request: {
                    method: req.method,
                    path: req.url
                },
                response: {
                    status: 401
                },
                email: req.body.email
            })
            res.status(401).json({
                error: {
                    message: 'This email address is already registered'
                }
            });
        } else {
            logger.log('info', 'User created', {
                request: {
                    method: req.method,
                    path: req.url
                },
                response: {
                    status: 201
                },
                user: {
                    userId: user._id,
                    email: user.email
                }
            })
            res.status(201).json({
                message: 'User created'
            });
        }
    } catch (error) {
        res.status(500).json({
            error
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
                logger.log('info', 'User logged in', {
                    request: {
                        method: req.method,
                        path: req.url
                    },
                    response: {
                        status: 200
                    },
                    user: {
                        userId: user._id,
                        email: user.email
                    }
                })
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
                logger.log('error', 'Invalid email and/or password', {
                    request: {
                        method: req.method,
                        path: req.url
                    },
                    response: {
                        status: 401
                    },
                    email: email
                });
                res.status(401).json({
                    message: 'Invalid email and/or password'
                })
            }
        } else {
            logger.log('error', 'User not found', {
                request: {
                    method: req.method,
                    path: req.url
                },
                response: {
                    status: 404
                },
                email: email
            });
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