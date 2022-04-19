/**
 * Nine digits validator
 *
 * @param {string} digits
 * @returns {Promise<Error | boolean>}
 */
const nineDigitsValidator = async (digits) => {
    return new Promise((resolve, reject) => {
        const expression = /^\d{9}$/
        const match = digits.match(expression)

        if (match === null) {
            return reject(new Error('Must be 9 digits'))
        }

        return resolve(true)
    })
}

module.exports = nineDigitsValidator