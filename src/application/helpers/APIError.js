/**
 * Class to handle API errors
 */
class APIError extends Error {

    /**
     * Default constructor for API errors
     *
     * @param {Error} error
     * @param {number} httpCode
     */
    constructor(error, httpCode = 400) {
        super(error.message)

        this.name = error.name
        this.statusCode = httpCode
        this.stack = error.stack
    }

    /**
     * Static method for custom message
     *
     * @param {string} message
     * @param {number} httpCode
     * @returns {Error}
     * @constructor
     */
    static CustomMessage(message, httpCode = 400) {
        const error = new Error(message)
        error.statusCode = httpCode
        return error
    }
}

module.exports = APIError