'use strict'
const errorResponse = require('./error-response')

module.exports = (req, res, next) => {
  res.status(405).json(errorResponse(res.statusCode))
}
