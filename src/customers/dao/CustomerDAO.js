// Schemas
const { createCustomerSchema } = require('../schemas')

// Models
const { CustomerModel } = require('../models')
const { APIError } = require('../../application/helpers')

/**
 * Add customer
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const addCustomer = async (schema) => {
    let validatedSchema = null

    try {
        validatedSchema = await createCustomerSchema.validateAsync(schema)
    } catch (e) {
        throw new APIError(e)
    }

    const found = await findCustomerByEmail(validatedSchema.email)
    if (found) {
        throw APIError.CustomMessage('Customer already exists')
    }

    try {
        const customer = new CustomerModel(validatedSchema)
        await customer.validate()
        await customer.save()
    } catch (e) {
        throw new APIError(e, 500)
    }
}

/**
 * Find customer by id
 *
 * @param {string} email
 */
const findCustomerByEmail = async (email) => {
    try {
        return await CustomerModel.findOne({ email: email })
    } catch (e) {
        throw new APIError(e, 500)
    }
}

const findAllCustomers = async () => {
    try {
        return await CustomerModel.find({})
    } catch (e) {
        throw new APIError(e, 500)
    }
}

module.exports = {
    addCustomer,
    findCustomerByEmail,
    findAllCustomers,
}