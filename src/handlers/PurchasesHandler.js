const { Request, Response, NextFunction } = require('express')
const { Purchase, Customer, Book } = require('../schemas')
const VatRates = require('eu-vat-rates')

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
            case 'custumer':
                await createWebPurchase(req.body)
                break
            default:
                throw Error('Acess denied')
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
const createWebPurchase = async (schema) => {
    throw Error('Not implemented')
}

/**
 * Add In Store type Purchase
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const createInStorePurchase = async (schema) => {
    schema.type = 'In Store'

    try {
        await customerExists(schema)
        await spentBalanceExists(schema.customer, schema.spent_balance)
        schema.subtotal = await calculateSubtotal(schema.books)
        schema.vat = VatRates.rates.PT.standard_rate
        schema.total = (schema.vat / 100) * schema.subtotal + schema.subtotal //apply discount and update balance
        schema.employee_num = '1' //brute force
        await addPurchase(schema)
    } catch (e) {
        throw e
    }
}

/**
 * Check if a customer exists given his reader_card_num
 *
 * @param {Object} schema
 * @returns {Promisse<void>}
 * @throws {Error} if the customer does not exist
 */
const customerExists = async (schema) => {
    var customer = null
    try {
        customer = await Customer.findOne({
            reader_card_num: schema.customer,
        })
    } catch (e) {
        throw e
    }

    if (customer == null) {
        throw Error('param: reader_card_num does not exists.')
    }
    schema.customer = customer._id
}

/**
 * Check if the spent balance is valid
 *
 * @param {Object} customer
 * @param {Number} spentBalance - The amount of points that the custumer wants to use
 * @returns {Promise<void>}
 * @throws {Error} if the spent_balance is not valid
 */
const spentBalanceExists = async (customer, spentBalance) => {
    if (customer.accumulated_balance > spentBalance) {
        throw Error('param: spent_balance is not valid.')
    }
}

/**
 * Calculates the purchase subtotal
 *
 * @param {Array.<String>} books - The array that contains the purchased books
 * @returns {Promise<Number>}
 */
const calculateSubtotal = async (books) => {
    var subtotal = 0
    var booksToUpdateStock = []

    if (!Array.isArray(books)) {
        throw Error('param: books is invalid.')
    }

    for (let i = 0; i < books.length; i++) {
        try {
            var book = await getBookAndValidateStock(books[i], i)
            booksToUpdateStock.push(book)
            var price = 0
            switch (books[i].type) {
                case 'New':
                    price = book.price_new * books[i].qnt
                    break
                case 'Used':
                    price = book.price_used * books[i].qnt
                    break
            }
            subtotal += price
        } catch (e) {
            throw e
        }
    }
    await updateBooksStock(booksToUpdateStock, books)
    return subtotal
}

/**
 * Updates the books stock
 *
 * @param {Array} booksToUpdateStock
 * @param {Array} books
 * @returns {Promisse<void>}
 */
const updateBooksStock = async (booksToUpdateStock, books) => {
    for (let i = 0; i < books.length; i++) {
        switch (books[i].type) {
            case 'New':
                booksToUpdateStock[i].stock_new -= books[i].qnt
                break
            case 'Used':
                booksToUpdateStock[i].stock_used -= books[i].qnt
                break
        }
        try {
            await booksToUpdateStock[i].validate()
            await booksToUpdateStock[i].save()
        } catch (e) {
            throw e
        }
    }
}

/**
 * Returns the book given his isbn and checks if the stock is avaliable
 *
 * @param {Object} book
 * @param {Number} i
 * @returns {Object}
 */
const getBookAndValidateStock = async (book, i) => {
    var bookData = null

    try {
        bookData = await Book.findOne({
            isbn: book.book,
        })
    } catch (e) {
        throw e
    }

    if (bookData == null) {
        throw Error('param: book index ' + i + ' does not exist')
    }
    if (book.type != 'New' && book.type != 'Used') {
        throw Error('param: book index ' + i + ' type must be New or Used')
    }
    if (book.type == 'New' && book.qnt <= bookData.stock_new) {
        book.book = bookData._id
        return bookData
    }
    if (book.type == 'Used' && book.qnt <= bookData.stock_used) {
        book.book = bookData._id
        return bookData
    }
    throw Error('param: book index ' + i + ' stock is invalid')
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
 * Get all Purchases
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllPurchases = async (req, res, next) => {
    try {
        const purchases = await Purchase.find({})

        const output = await Promise.all(
            purchases.map(async (purchases) => {
                return {
                    books: await handleBooks(purchases.books),
                    type: purchases.type,
                    customer: await handleCustomer(purchases.customer),
                    spent_balance: purchases.spent_balance,
                    payment_method: purchases.payment_method,
                    subtotal: purchases.subtotal,
                    vat: purchases.vat,
                    total: purchases.total,
                    employee_num: purchases.employee_num,
                    created_at: handleDate(purchases.created_at),
                }
            })
        )
        return res.status(200).json({ purchases: output })
    } catch (e) {
        return next(e)
    }
}

/**
 * Parse the books _id to isbn
 *
 * @param {Array} books
 * @returns {Promise<Object>}
 */
const handleBooks = async (books) => {
    var parsedBooks = []

    for (let i = 0; i < books.length; i++) {
        parsedBooks[i] = JSON.parse(JSON.stringify(books[i]))
        try {
            var book = await Book.findOne({ _id: books[i].book })
            parsedBooks[i].book = book.isbn
        } catch (e) {
            throw e
        }
    }
    return parsedBooks
}

/**
 * Parse the customer _id to reader_card_num
 *
 * @param {Object} customer
 * @returns {Promise<Object>}
 */
const handleCustomer = async (customer) => {
    var parsedCustomer = JSON.parse(JSON.stringify(customer))

    try {
        var customerData = await Customer.findOne({ _id: customer })
        parsedCustomer = customerData.reader_card_num
    } catch (e) {
        throw e
    }
    return parsedCustomer
}

/**
 * Converts date format
 *
 * @param {Object} date
 * @returns {Promisse<void>}
 */
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
    readerCardNum = req.params['customer']
    try {
        const purchases = await Purchase.find({
            reader_card_num: readerCardNum,
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
