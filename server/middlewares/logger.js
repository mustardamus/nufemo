const winston = require('winston')

module.exports = (app) => {
  return (err, req, res, next) => {
    if (err) {
      const message = `${err.code ? `(${err.code})` : ''} Route: ${req.url} - ${err.message}`

      if (err.code === 404) {
        // winston.info(message)
      } else {
        // winston.error(message)
        // winston.info(err.stack)
      }
    }

    next(err)
  }
}
