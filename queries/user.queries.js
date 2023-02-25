const User = require('../database/models/user.model');

exports.createUser = async (body) => {
    try {
        const hashedPassword = await User.hashPassword(body.password);
        const user = new User({
            email: body.email,
            password: hashedPassword
        });
        user.save();
    } catch (error) {
        res.status(400).json({
            error
        });
    };
};

exports.findUserPerEmail = (email) => {
    return User.findOne({
        'email': email
    }).exec();
}