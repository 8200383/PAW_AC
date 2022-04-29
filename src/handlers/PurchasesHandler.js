const { Request, Response, NextFunction } = require('express')
const { Purchase } = require('../schemas')
const { Customer } = require('../schemas')

/**
 * Create a Purchase
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const createPurchase = async (req, res, next) => {
    var user = 'employee' //brute force

    try {
        switch (user) {
            case 'employee':
                await createInStorePurchase(req.body)
                break
            case 'costumer':
                await createWebPurchase(req.body)
                break
            default:
                throw new Error('Acess denied')
        }
        res.status(200).json({ message: 'Purchase successfully added' })
    } catch (e) {
        return next(e)
    }
}

/**
 * Add Web type Purchase
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const createWebPurchase = async (schema) => {}

/**
 * Add In Store type Purchase
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const createInStorePurchase = async (schema) => {
    var costumer = null
    schema.type = 'In Store'

    try {
        costumer = await findCostumer(schema.reader_card_num)
        await costumerExists(costumer)
        await spentBalanceExists(schema.reader_card_num, schema.spent_balance)
        schema.subtotal = await calculateSubtotal(schema.isbn)
        schema.vat = await getVat()
        schema.total = schema.vat * schema.subtotal + schema.subtotal //apply discount and update balance
        schema.employee_num = '1' //brute force
        await addPurchase(schema)
    } catch (e) {
        throw e
    }
}

/**
 * Find a Costumer by his reader card number
 *
 * @param {Number} readerCardNum - Identifies the costumer
 * @returns {Promisse<CustomerModel>}
 */
const findCostumer = async (readerCardNum) => {
    var costumer = null

    try {
        costumer = await Customer.findOne({
            reader_card_num: readerCardNum,
        })
        return costumer
    } catch (e) {
        throw e
    }
}

/**
 * Verifies if the costumer exists
 *
 * @param {Object} costumer
 * @returns {Promise<void>}
 */
const costumerExists = async (costumer) => {
    if (costumer == null) {
        throw Error('param: reader_card_num does not exists.')
    }
}

/**
 * Verifies if the spent balance is valid
 *
 * @param {Object} costumer
 * @param {Number} spentBalance - The amount of points that the costumer wants to use
 * @returns {Promise<void>}
 */
const spentBalanceExists = async (costumer, spentBalance) => {
    if (costumer.accumulated_balance > spentBalance) {
        throw Error('param: spent_balance is not valid.')
    }
}

/**
 * Calculates the purchase subtotal
 *
 * @param {Array.<String>} isbn - The array that contains the purchased books
 * @returns {Promise<Number>}
 */
const calculateSubtotal = async (isbn) => {
    var subtotal = 0

    if (!Array.isArray(isbn)) {
        throw Error('param: isbn is invalid.')
    }

    for (let i = 0; i < isbn.length; i++) {
        try {
            let price = 30 // let book = await BookModel.findOne({ isbn: isbn[i] }).price
            subtotal += price // await bookExists(book)
        } catch (e) {
            throw e
        }
    }
    return subtotal
}

/**
 * Returns the VAT
 *
 * @returns {Promise<Number>}
 */
const getVat = async () => {
    return 0.23 //brute force
}

/**
 * Creates a Purchase
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const addPurchase = async (schema) => {
    var purchase = null

    try {
        purchase = new Purchase(schema)
        await purchase.validate()
        await purchase.save()
    } catch (e) {
        throw e
    }
}

/**
 * Verifies if the book exists
 *
 * @param {Object} book
 * @returns {Promisse<void>}
 */
const bookExists = async (book) => {
    if (book == null) {
        throw Error('param: isbn index ' + i + ' is invalid')
    }
}

/**
 * Get all Purchases
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllPurchases = async (req, res, next) => {
    try {
        const purchases = await Purchase.find({})

        const output = purchases.map((purchases) => {
            return {
                isbn: purchases.isbn.join(', '),
                type: purchases.type,
                reader_card_num: purchases.reader_card_num,
                spent_balance: purchases.spent_balance,
                payment_method: purchases.payment_method,
                subtotal: purchases.subtotal,
                vat: purchases.vat,
                total: purchases.total,
                employee_num: purchases.employee_num,
                created_at: handleDate(purchases.created_at),
            }
        })

        return res.status(200).json({ purchases: output })
    } catch (e) {
        next(e)
    }
}

const handleDate = (date) => {
    const dateObj = new Date(date)
    return (
        dateObj.getDate().toString() +
        '/' +
        dateObj.getMonth().toString() +
        '/' +
        dateObj.getFullYear().toString()
    )
}

/**
 * Get a Customer's Purchases
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getPurchaseByCostumer = async (req, res, next) => {
    try {
        const purchases = await Purchase.find({
            reader_card_num: req.readerCardNum,
        })
        res.status(200).json({ purchases: purchases })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseByCostumer,
}
