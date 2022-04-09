const createHttpError = require('http-errors')

function notFoundMiddleware(req, res, next) {
    const httpError = createHttpError(404)
    next(httpError)
}

module.exports = notFoundMiddleware