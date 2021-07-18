const jwt = require('jsonwebtoken')

function veruser (req, res, next) {
    jwt.verify(req.headers.authorization, process.env.JWT_CODE, (err,payload) => {
        if (err) {
            return res.status(401).send(err)
        }
        if (!payload.auth_type) {
            req.user = payload
            next()
        }else{
            return res.status(401).send('please login to continue')
        }
    })
}

module.exports = veruser