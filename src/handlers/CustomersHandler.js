const { Customer } = require('../schemas')

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

        return res.status(200).json({
            message: 'Customer successfully added',
            customer: customer,
        })
    } catch (e) {
        const error = new Error(e.message)
        error.status = 400

        return next(error)
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
        const customers = await Customer.find({ active: true })

        const output = customers.map((customer) => {
            return {
                reader_card_num: customer.reader_card_num,
                name: customer.name,
                birth_date: customer.birth_date ?? ' ',
                cell_phone: customer.cell_phone ?? ' ',
                country: customer.country ?? ' ',
            }
        })

        return res.status(200).json({ customers: output })
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
            { runValidators: true }
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
        const customer = await Customer.findOne({
            reader_card_num: req.params.reader_card_num,
        })
        customer.active = false
        await customer.validate()
        await customer.save()

        return res.status(200).json({ customer })
    } catch (e) {
        return next(e)
    }
}

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomer,
    patchCustomer,
    deleteCustomer,
}
