'use strict'
const jwt = require('jsonwebtoken')
const errorResponse = require('./error-response')

module.exports = Object.freeze({
  generateAccessToken: (user) => {
    return jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30m',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    })
  },
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json(errorResponse(res.statusCode, 'Unauthorized'))

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json(errorResponse(res.statusCode, err))
      req.user = user
      next()
    })
  },
  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
  },
})
