// Models
const { CustomerModel } = require('../models')

// Helpers
const { APIError } = require('../../application/helpers')

/**
 * Add customer
 *
 * @param {Object} body
 * @returns {Promise<void>}
 */
const addCustomer = async (body) => {
    try {
        const customer = new CustomerModel(body)
        await customer.validate()
        await customer.save()
    } catch (e) {
        throw new APIError(e, 500)
    }
}

/**
 * Find customer by reader card number
 *
 * @param {number} readerCardNumber
 * @returns {Promise<*>}
 */
const findCustomerByReaderCardNumber = async (readerCardNumber) => {
    try {
        return await CustomerModel.findOne({ reader_card_number: readerCardNumber })
    } catch (e) {
        throw new APIError(e, 500)
    }
}

/**
 * Find all customers
 *
 * @returns {Promise<*>}
 */
const findAllCustomers = async () => {
    try {
        return await CustomerModel.find({})
    } catch (e) {
        throw new APIError(e, 500)
    }
}

/**
 * Update customer by reader card number
 *
 * @param {number} readerCardNumber
 * @param {object} body
 * @returns {Promise<*>}
 */
const updateCustomerByReaderCardNumber = async (readerCardNumber, body) => {
    try {
        return await CustomerModel.updateOne(
            { reader_card_number: readerCardNumber },
            { $set: body },
            { runValidators: true },
        )
    } catch (e) {
        throw new APIError(e, 500)
    }
}

module.exports = {
    addCustomer,
    findAllCustomers,
    findCustomerByReaderCardNumber,
    updateCustomerByReaderCardNumber,
}