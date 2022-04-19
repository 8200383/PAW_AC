// Models
const { PurchaseModel } = require('../models')
const { CustomerModel } = require('../../customers/models')

const { APIError } = require('../../application/helpers')

/**
 * Add Purchase
 *
 * @param {Object} schema
 * @param {String} user - Identifies the user's role
 * @returns {Promise<void>}
 */
const addPurchase = async (schema, user) => {
    switch (user) {
        case 'employee':
            await addInStorePurchase(schema)
            break
        case 'costumer':
            await addWebPurchase(schema)
            break
        default:
            throw new APIError(new Error('Acess denied'), 403)
    }
}

/**
 * Add In Store type Purchase
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const addInStorePurchase = async (schema) => {
    var costumer = null
    schema.type = 'In Store'

    try {
        costumer = await findCostumer(schema.reader_card_num)
        if (costumer == null) {
            throw new APIError(
                new Error('param: reader_card_num does not exists. '),
                500,
            )
        }

        await spentBalanceExists(schema.reader_card_num, schema.spent_balance)
        schema.subtotal = await calculateSubtotal(schema.isbn)
        schema.vat = await getVat()
        schema.total = schema.vat * schema.subtotal + schema.subtotal //apply discount and update balance
        schema.employee_num = '1' //brute force

        const purchase = new PurchaseModel(schema)
        await purchase.validate()
        await purchase.save()
    } catch (e) {
        throw new APIError(e, 500)
    }
}

/**
 * Add Web type Purchase
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const addWebPurchase = async (schema) => {
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
        costumer = await CustomerModel.findOne({
            reader_card_num: readerCardNum,
        })
        return costumer
    } catch (e) {
        throw new APIError(e, 500)
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
        throw new APIError(new Error('param: spent_balance is not valid.'), 500)
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
        throw new APIError(new Error('param: isbn is invalid.'), 500)
    }

    for (let i = 0; i < isbn.length; i++) {
        try {
            let price = 30 //await BookModel.findOne({ isbn: isbn[i] }).price
            if (price == null) {
                throw new APIError(
                    new Error('param: isbn index ' + i + ' is invalid'),
                    500,
                )
            }
            subtotal += price
        } catch (e) {
            throw new APIError(e, 500)
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
 * Returns all the Purchases
 *
 * @returns {Promise<PurchaseModel>}
 */
const findAllPurchases = async () => {
    try {
        return await PurchaseModel.find({})
    } catch (e) {
        throw new APIError(e, 500)
    }
}

/**
 * Returns a Customer's Purchases
 *
 * @param {Number} readerCardNum
 * @returns {Promise<PurchaseModel>}
 */
const findPurchasesByCostumer = async (readerCardNum) => {
    try {
        return await PurchaseModel.find({ reader_card_num: readerCardNum })
    } catch (e) {
        throw new APIError(e, 500)
    }
}

module.exports = {
    addPurchase,
    findAllPurchases,
    findPurchasesByCostumer,
}
