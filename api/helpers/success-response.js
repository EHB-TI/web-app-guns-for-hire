'use strict'
module.exports = function (statusCode, data) {
  let message
  switch (statusCode) {
    case 200:
      message = 'OK'
      break
    case 201:
      message = 'Created'
    default:
      break
  }
  return {
    status: statusCode,
    message,
    data,
  }
}
