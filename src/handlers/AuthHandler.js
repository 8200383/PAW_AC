const { Request, Response } = require('express')
const { Account } = require('../schemas')
const { hash, compareSync } = require('bcrypt')
const security = require('../configs/security.json')
const { generateToken } = require('../helpers')

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const auth = async (req, res, next) => {

    const { isValidPassword, account } = await Account.findOne({ email: req.body.email }).then((found) => {
        return {
            isValidPassword: compareSync(req.body.password, found.password),
            account: found,
        }
    })

    if (!isValidPassword) {
        return res.status(400).json({
            message: 'Wrong password',
        })
    }

    if (account) {
        return res.json({
            message: 'Signin successful',
            token: generateToken(account),
        })
    }

    try {
        const encrypted = await hash(req.body.password, security.saltRounds)
        const account = await Account.create({
            email: req.body.email,
            password: encrypted,
            role: req.body.role,
        })

        return res.json({
            message: 'Signup successful',
            account: account,
        })
    } catch (e) {
        return next(e)
    }
}

module.exports = {
    auth,
}