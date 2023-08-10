const User = require('../models/user');
const {body, validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

exports.check_email = [
    body('email', 'E-mail must be a valid address.').isEmail()
    .trim()
    .escape()
    .normalizeEmail(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json(errors.array());
        else {
            try {
                const user = await User.findOne({ email: req.body.email }).exec();
                if (!user) next();
                else {
                    return res.json([{ msg: 'Email has already been used.' }]);
                }
            } catch (err) {
                return res.json(err);
            }
        }
    }
]

exports.create_user = [
    body('pwd', 'Password must not be empty.')
        .isLength({ min: 4 }).withMessage('Password must contain at least 4 characters.')
        .matches('[A-Z]').withMessage('Password must contain at least 1 upper letter.')
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .trim()
        .escape(),
    body('username', 'Username must not be empty.')
        .isLength({ min: 4, max: 12 }).withMessage('Username must contain between 4 and 12 characters.')
        .trim()
        .escape(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json(errors.array());
        try {
            const hashedPwd = await bcryptjs.hash(req.body.pwd, 6);
            const user = await new User({
                email: req.body.email,
                password: hashedPwd,
                name: req.body.username,
                friends: []
            }).save();
            res.json(user);
        } catch (err) {
            return res.json(err);
        }
    }
]

exports.login = [
    body('email', 'E-mail must be a valid address.').isEmail()
    .trim()
    .escape()
    .normalizeEmail(),

    async (req, res, next) => {
        try {
            const user = await User.findOne({'email': req.body.email}).exec();
            if(!user) return res.json(false)
            bcryptjs.compare(req.body.pwd, user.password, (err, passwordMatch) => {
                if(passwordMatch){
                    jwt.sign({user}, `${process.env.SECRET_KEY}`, {expiresIn: '6s'} ,(err, token) => {
                        if(err) return res.json(err)
                        return res.json(token)
                    })
                } else {
                    return res.json({ message: 'Password does not match' });
                }
            })
        } catch (err) {
            return res.json(err)
        }
    }
]

exports.validate_token = function(req, res, next){
    // FORMAT
    // Authorization : Bearer <access_token>

    // Get auth header value
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined'){
        // Separar usando el espacio.
        const bearer = bearerHeader.split(' ')
        // Obtener el token.
        const bearerToken = bearer[1]

        jwt.verify(bearerToken, `${process.env.SECRET_KEY}`, (err) => {
            if(err) return res.sendStatus(403)
            else {
                next()
            }
        })
    } else {
        return res.json('forbidden')
    }
}

exports.get_user_data = function(req, res, next){
    // FORMAT
    // Authorization : Bearer <access_token>

    // Get auth header value
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined'){
        // Separar usando el espacio.
        const bearer = bearerHeader.split(' ')
        // Obtener el token.
        const bearerToken = bearer[1]

        jwt.verify(bearerToken, `${process.env.SECRET_KEY}`, (err, authData) => {
            if(err) return res.json(false)
            else {
                const {name} = authData.user
                return res.json({name})
            }
        })
    } else {
        return res.json('forbidden')
    }
}
