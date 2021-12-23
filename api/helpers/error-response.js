'use strict'
module.exports = function (statusCode, errorMessage) {
  let message
  if (errorMessage) {
    message = errorMessage
  } else {
    switch (statusCode) {
      case 404:
        message = 'Not Found'
        break
      case 405:
        message = 'Method Not Allowed'
        break
      case 406:
        message = 'Not Acceptable'
        break
      default:
        break
    }
  }
  return {
    status: statusCode,
    error: message,
  }
}
