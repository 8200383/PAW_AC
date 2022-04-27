const jwt = require('jsonwebtoken')
const security = require('../configs/security.json')

/**
 * Generate JWT Token
 * @param {{email: String, role: String}} payload
 * @returns {*}
 */
const generateToken = (payload) => {
    const options = { expiresIn: '1h' }

    return new Promise((resolve, reject) => {
        jwt.sign(payload, security.secret, options, (err, token) => {
            if (err) reject(err)

            resolve(token)
        })
    })
}

module.exports = generateToken