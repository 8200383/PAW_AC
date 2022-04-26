const createError = require("http-errors");

const notFoundMiddleware = (req, res, next) => {
    next(createError(404));
}

module.exports = notFoundMiddleware