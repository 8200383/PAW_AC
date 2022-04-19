const { Request, Response, NextFunction } = require('express')

// DAO
const { CustomerDAO } = require('../dao')
const { APIError } = require('../../application/helpers')

/**
 * Create a Customer
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
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
 * @param {NextFunction} next
 */
const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await CustomerDAO.findAllCustomers()
        res.status(200).json({ customers: customers })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

module.exports = {
    createCustomer,
    getAllCustomers,
}