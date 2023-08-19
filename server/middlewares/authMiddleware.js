const jwt = require('jsonwebtoken');

const validate_token = function(req, res, next){
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
            if(err) return res.json(err)
            else {
                req.userId = authData.user._id
                next()
            }
        })
    } else {
        return res.json('forbidden')
    }
}

module.exports = { validate_token }