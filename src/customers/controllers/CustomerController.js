const { Request, Response } = require('express')

// DAO
const { CustomerDAO } = require('../dao')

// Helpers
const { APIError } = require('../../application/helpers')

/**
 * Create a customer
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
const createCustomer = async (req, res, next) => {
    try {
        await CustomerDAO.addCustomer(req.body)
        res.status(200).json({ message: 'Customer successfully added' })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

/**
 * Get all customers
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await CustomerDAO.findAllCustomers()
        res.status(200).json({ customers: customers })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

/**
 * Get customer by reader carn number
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
const getCustomer = async (req, res, next) => {
    try {
        const customer = await CustomerDAO.findCustomerByReaderCardNumber(req.params['reader_card_num'])
        res.status(200).json({ customer })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

/**
 * Patch customer by reader card number
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
const patchCustomerController = async (req, res, next) => {
    try {
        const customer = await CustomerDAO.updateCustomerByReaderCardNumber(req.params['reader_card_num'], req.body)
        res.status(200).json({ customer })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomer,
    patchCustomerController,
}