const { Request, Response } = require('express')
const { Account } = require('../schemas')
const { hash, compare } = require('bcrypt')
const security = require('../configs/security.json')
const { generateToken } = require('../helpers')

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const auth = async (req, res, next) => {

    const { hasAccount, account } = await Account.findOne({ email: req.body.email })
        .then((result) => {
            return { hasAccount: true, account: result }
        })
        .catch((e) => {
            console.log(e)
            return { hasAccount: false, account: null }
        })

    console.log(hasAccount, account)


    if (hasAccount) {

        const isValid = await compare(req.body.password, account.password).catch((e) => {
            return e !== null
        })

        if (!isValid) {
            return next(new Error('Wrong password'))
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
        return next(e)
    }
}

module.exports = {
    auth,
}