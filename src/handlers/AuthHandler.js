const { Request, Response } = require('express')
const { Account } = require('../schemas')

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const signUp = async (req, res, next) => {
    try {
        const account = new Account({
            username: req.body.username,
            role: req.body.role,
        })

        await Account.register(account, req.body.password)

        return res.json({
            message: 'Signup successful',
            account: account,
        })
    } catch (e) {
        next(e)
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const signIn = async (req, res, next) => {
    res.json('ok')
}

module.exports = {
    signUp,
    signIn,
}