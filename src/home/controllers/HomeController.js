const { Request, Response } = require('express')

/**
 * Index
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const index = async (req, res) => {
    return res.render('index', { title: 'PAW' })
}

module.exports = {
    index,
}