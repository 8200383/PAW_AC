/**
 * Generic Express error handler middleware.
 *
 * @param {Error} error - An Error object.
 * @param {Request} request - Express request object
 * @param {Response} response - Express response object
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
        details: error.message || error.name,
        stack: error.stack,
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

module.exports = errorHandlerMiddleware