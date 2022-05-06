/**
 * Validate cell phone
 *
 * @param {string} postalCode
 * @returns {Promise<Error | boolean>}
 */
const postalCodeValidator = async (postalCode) => {
    return new Promise((resolve, reject) => {
        if (postalCode == null) {
            return resolve(true)
        }

        const expression = /^\d{4}(-\d{3})?$/
        const match = postalCode.match(expression)

        if (match === null) {
            return reject(new Error('Must be a valid postal code, like: 4610-812'))
        }

        return resolve(true)
    })
}

module.exports = postalCodeValidator