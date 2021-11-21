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

      default:
        break
    }
  }
  return {
    status: statusCode,
    error: message,
  }
}
