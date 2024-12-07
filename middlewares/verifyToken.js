const jwt = require('jsonwebtoken')
const getToken = require('../helpers/get-token')

// middleware to validate token
const checkToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Acesso Negado!' })
    }

    const token = getToken(req)

    if (!token) {
        return res.status(401).json({ message: 'Acesso Negado!' })
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (err) {
        return res.status(400).json({ message: 'Token inválido!' })
    }
}

module.exports = checkToken