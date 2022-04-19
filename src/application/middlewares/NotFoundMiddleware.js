const createHttpError = require('http-errors')

/**
 * Not Found 404 Middleware
 *
 * @param {Object} req - Express request object
 * @param {Object} res- Express response object
 * @param {Function} next - Express `next()` function
 */
function notFoundMiddleware(req, res, next) {
    next(createHttpError(404))
}

module.exports = notFoundMiddleware