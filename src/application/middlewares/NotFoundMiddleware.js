const { APIError } = require('../helpers')

/**
 * Not Found 404 Middleware
 *
 * @param {Object} req - Express request object
 * @param {Object} res- Express response object
 * @param {Function} next - Express `next()` function
 */
function notFoundMiddleware(req, res, next) {
    next(APIError.CustomMessage('Page or Route not found', 404))
}

module.exports = notFoundMiddleware