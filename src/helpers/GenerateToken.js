const jwt = require('jsonwebtoken')
const jwtSecret = require('../configs/security.json')

/**
 * Generate JWT Token
 * @param {object} account
 * @returns {*}
 */
const generateToken = (account) => {
    return jwt.sign({
        iss: account.email,
        role: account.role,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
    }, jwtSecret.secret)
}

module.exports = generateToken