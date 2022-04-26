const index = async (req, res, next) => {
    return res.render('views/index')
}

module.exports = {
    index,
}