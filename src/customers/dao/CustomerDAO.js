// Schemas
const { createCustomerSchema } = require('../schemas')

// Models
const { CustomerModel } = require('../models')

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
        throw new Error('Failed to validate schema ' + e)
    }

    const found = await findCustomerByEmail(validatedSchema.email)
    if (found) {
        throw new Error('Customer already exists')
    }

    try {
        const customer = new CustomerModel(validatedSchema)
        await customer.validate()
        await customer.save()
    } catch (e) {
        throw new Error('Failed to save into the databse ' + e)
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
        throw new Error('Unexpected error occured: ' + e)
    }
}

const findAllCustomers = async () => {
    try {
        return await CustomerModel.find({})
    } catch (e) {
        throw new Error('Unexpected error occured: ' + e)
    }
}

module.exports = {
    addCustomer,
    findCustomerByEmail,
    findAllCustomers,
}