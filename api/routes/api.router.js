'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')

// sub routes
router.use('/auth', require('./auth.router'))
router.use('/spotify', require('./spotify.router'))
router.use('/twitch', require('./twitch.router'))

// not found routes
router.get('*', (req, res) => {
  res.status(404).json(errorResponse(res.statusCode))
})

module.exports = router
