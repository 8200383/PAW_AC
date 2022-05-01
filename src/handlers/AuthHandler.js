const { Request, Response } = require('express')
const { Account } = require('../schemas')
const { hash, compare } = require('bcrypt')
const security = require('../configs/security.json')
const { generateToken } = require('../helpers')

/**
 * Auth
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const auth = async (req, res, next) => {

    const { hasAccount, account } = await Account.findOne({ email: req.body.email })
        .then((result) => {
            return { hasAccount: result !== null, account: result }
        })
        .catch(() => {
            return { hasAccount: false, account: null }
        })

    if (hasAccount) {

        const isValid = await compare(req.body.password, account.password).catch((e) => {
            return e !== null
        })

        if (!isValid) {
            const error = new Error('Wrong password')
            error.status = 401

            return next(error)
        }

        const token = await generateToken({ email: account.email, role: account.role })

        return res.json({
            message: 'Signin successful',
            token: token,
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
        const error = new Error(e.message)
        error.status = 400

        return next(error)
    }
}

const getAccountInfo = async (req, res, next) => {
    try {
        const account = await Account.findOne({ email: req.params.email })

        return res.json({ email: account.email, role: account.role })
    } catch (e) {
        const error = new Error(e.message)
        error.status = 400

        return next(error)
    }
}

module.exports = {
    auth,
    getAccountInfo,
}