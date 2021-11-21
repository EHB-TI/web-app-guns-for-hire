'use strict'
const errorResponse = require('../helpers/error-response')
module.exports = (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'OPTIONS') {
    if (req.headers['content-type'] == null || req.headers['content-type'] != 'application/json') {
      res
        .status(406)
        .json(errorResponse(res.statusCode, 'We only support application/json requests'))
    }
  } else {
    next()
  }
}
