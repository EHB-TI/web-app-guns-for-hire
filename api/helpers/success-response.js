'use strict'
module.exports = function (statusCode, data) {
  let message
  switch (statusCode) {
    case 200:
      message = 'OK'
      break

    default:
      break
  }
  return {
    status: statusCode,
    message,
    data,
  }
}
