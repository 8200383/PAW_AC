const { Request } = require('express')

// Schemas
const { createCustomerSchema } = require('../schemas')
const { Customer } = require('../models')

/**
 * Add customer
 *
 * @param {Request.body} body
 * @returns {Promise<void>}
 */
const addCustomer = async (body) => {
    try {
        const validatedSchema = await createCustomerSchema.validateAsync(body)

        const customer = new Customer(validatedSchema)
        await customer.validate()
        await customer.save()
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {
    addCustomer,
}