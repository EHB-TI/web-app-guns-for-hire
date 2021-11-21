'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const useJsonAPI = require('../middleware/json-api')

// only allow json requests
router.use(useJsonAPI)

// options api
router.options('*', (req, res) => {
  if (req.headers.origin == null) {
    res.status(400).json(errorResponse(res.statusCode, 'Origin header missing'))
  } else {
    res
      .header('Access-Control-Allow-Origin', `${req.headers.origin}`)
      .header('Access-Control-Allow-Headers', '*')
      .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
      .header('Vary', 'Origin')
      .status(200)
      .json(successResponse(res.statusCode, 'Check the response headers to see the API options'))
  }
})

// sub routes
router.use('/auth', require('./auth.router'))
router.use('/spotify', require('./spotify.router'))

// not found routes
router.get('*', (req, res) => {
  res.status(404).json(errorResponse(res.statusCode))
})

module.exports = router
