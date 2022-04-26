const exceptionMiddleware = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err });
}

module.exports = exceptionMiddleware