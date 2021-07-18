const jwt = require('jsonwebtoken')

function veradmin (req, res, next) {
    jwt.verify(req.headers.authorization, process.env.JWT_CODE, (err,payload) => {
        if (err) {
            return res.status(401).send(err)
        }
        if (payload.type) {
            next()
        }else{
            return res.status(401).send('ADMIN ONLY')
        }
    })
}

module.exports = veradmin