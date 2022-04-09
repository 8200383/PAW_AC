/**
 * Generic Express error handler middleware.
 *
 * @param {Error} error - An Error object.
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express `next()` function
 */
function errorHandlerMiddleware(error, request, response, next) {

    /*
     * If response headers have already been sent,
     * delegate to the default Express error handler.
     */
    if (response.headersSent) {
        return next(error)
    }

    const errorResponse = {
        statusCode: error.status || error.statusCode,
        body: getErrorMessage(error),
    }

    // Log an error message to stderr.
    console.error(errorResponse)

    response.status(errorResponse.statusCode)

    response.format({
        /**
         * Callback to run when application/json matched.
         */
        'application/json': () => {
            /**
             * Set a JSON formatted response body.
             * Response header: `Content-Type: `application/json`
             */
            response.json(errorResponse)
        },
        /**
         * Callback to run when none of the others are matched.
         */
        default: () => {
            /**
             * Set a plain text response body.
             * Response header: `Content-Type: text/plain`
             */
            response.type('text/plain').send(errorResponse.body)
        },
    })

    // Ensure any remaining middleware are run.
    next()
}


/**
 * Extract an error stack or error message from an Error object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 *
 * @param {Error} error
 * @return {string} - String representation of the error object.
 */
function getErrorMessage(error) {
    /**
     * If it exists, prefer the error stack as it usually
     * contains the most detail about an error:
     * an error message and a function call stack.
     */
    if (error.stack) {
        return error.stack
    }

    if (typeof error.toString === 'function') {
        return error.toString()
    }

    return ''
}

module.exports = errorHandlerMiddleware