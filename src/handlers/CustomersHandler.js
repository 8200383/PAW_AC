const { Customer } = require('../schemas')

/**
 * Index page for Customers
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
const index = async (req, res, next) => {
    return res.render('index', {
        page: 'Customers',
        action: 'Create Customer',
    })
}

/**
 * Create a Customer
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const createCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.create(req.body)

        res.status(200).json({
            message: 'Customer successfully added',
            customer: customer,
        })
    } catch (e) {
        next(e)
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
        const customers = await Customer.find({})

        return res.status(200).json({ customers: customers })
    } catch (e) {
        return next(e)
    }
}

/**
 * Get customer by reader card number
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({
            reader_card_num: req.params.reader_card_num,
        })

        return res.status(200).json({ customer: customer })
    } catch (e) {
        return next(e)
    }
}

/**
 * Patch customer by reader card number
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
const patchCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.updateOne(
            { reader_card_num: req.params.reader_card_num },
            { $set: req.body },
            { runValidators: true },
        )

        return res.status(200).json({ customer })
    } catch (e) {
        return next(e)
    }
}

/**
 * Delete customer by reader card number
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.deleteOne(
            { reader_card_num: req.params.reader_card_num },
        )

        return res.status(200).json({ customer })
    } catch (e) {
        return next(e)
    }
}

module.exports = {
    index,
    createCustomer,
    getAllCustomers,
    getCustomer,
    patchCustomer,
    deleteCustomer,
}