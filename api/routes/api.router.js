'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const restfulRoute = require('../helpers/restful-route')

router.use((req, res, next) => {
  if (req.headers.accept !== 'application/json') {
    if (req.headers.accept === '*/*') {
      next()
    } else {
      res
        .status(406)
        .json(
          errorResponse(
            res.statusCode,
            'Make sure you have a valid Accept header (application/json, or */*)'
          )
        )
    }
  } else {
    next()
  }
})

// sub routes
router.use('/auth', require('./auth.router'))
router.use('/spotify', require('./spotify.router'))
router.use('/twitch', require('./twitch.router'))

// not found routes
router
  .route('*')
  .get((req, res) => {
    res.status(404).json(errorResponse(res.statusCode))
  })
  .put((req, res) => {
    res.status(404).json(errorResponse(res.statusCode))
  })
  .options((req, res) => {
    res.status(404).json(errorResponse(res.statusCode))
  })
  .all(restfulRoute)

module.exports = router
