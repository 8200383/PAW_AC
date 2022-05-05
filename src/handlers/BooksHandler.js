const { Request, Response, NextFunction } = require('express')
const { Book } = require('../schemas')
const Isbn = require('node-isbn')

/**
 * Create a Book
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const createBook = async (req, res, next) => {
    Isbn.provider([Isbn.PROVIDER_NAMES.GOOGLE])
        .resolve(req.body.isbn)
        .then(async (book) => {
            console.log(book)
            let schema = await createSchema(req.body, book)
            await addBook(schema)
            res.status(200).json({ added_book: schema })
        })
        .catch((e) => {
            const error = new Error(e.message)
            error.status = 400
            next(error)
        })
}

/**
 * Create book schema with google books api
 *
 * @param {Object} body
 * @param {Object} book
 * @returns {Promise<Object>}
 */
const createSchema = async (body, book) => {
    verifyFields(book)
    return {
        isbn: body.isbn,
        title: book.title,
        authors: book.authors,
        publisher: book.publisher,
        published_date: book.publishedDate,
        language: book.language,
        pages: book.pageCount,
        description: book.description,
        category: body.category,
        maturaty_rating: book.maturityRating,
        stock_new: body.stock_new,
        stock_used: body.stock_used,
        price_new: body.price_new,
        price_used: body.price_used,
        images: {
            small_thumbnail: book.imageLinks.smallThumbnail,
            thumbnail: book.imageLinks.thumbnail,
        },
    }
}

const verifyFields = (book) => {
    if (book.publisher == undefined) {
        book.publisher = ''
    }
    if (book.description == undefined) {
        book.description = ''
    }
    if (book.imageLinks == undefined) {
        book.imageLinks = ''
    }
    if (book.imageLinks.smallThumbnail == undefined) {
        book.imageLinks.smallThumbnail = ''
    }
    if (book.imageLinks.thumbnail == undefined) {
        book.imageLinks.thumbnail = ''
    }
}

/**
 * Checks if book already exists
 *
 * @param {String} isbn
 * @returns {Promisse<void>}
 * @throws {Error} if the book already exists
 */
const bookExists = async (isbn) => {
    var book = null

    try {
        book = await Book.findOne({
            isbn: isbn,
        })
    } catch (e) {
        throw e
    }

    if (book != null) {
        throw Error('Book already exists.')
    }
}

/**
 * Adds a Book to the data base
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const addBook = async (schema) => {
    try {
        var book = new Book(schema)
        await bookExists(schema.isbn)
        await book.validate()
        await book.save()
    } catch (e) {
        throw e
    }
}

/**
 * Returns a book given his isbn
 *
 * @param {String} isbn
 * @returns {Object}
 * @throws {Error} if the book does not exist
 */
const findBook = async (isbn) => {
    var book = null

    try {
        book = await Book.findOne({
            isbn: isbn,
        })
    } catch (e) {
        throw e
    }

    if (book == null) {
        throw Error('The book does not exist.')
    }
    return book
}

/**
 * Update book stock
 *
 * @param {String} isbn
 * @param {Number} stock
 * @param {String} type
 * @returns {Promisse<void>}
 */
const updateStock = async (isbn, stock, type) => {
    try {
        var book = await findBook(isbn)
        switch (type) {
            case 'used':
                book.stock_used = stock
                break
            case 'new':
                book.stock_new = stock
                break
        }
        await book.validate()
        await book.save()
    } catch (e) {
        throw e
    }
}

/**
 * Update book price
 *
 * @param {String} isbn
 * @param {Number} price
 * @param {String} type
 * @returns {Promisse<void>}
 */
const updatePrice = async (isbn, price, type) => {
    try {
        var book = await findBook(isbn)
        switch (type) {
            case 'used':
                book.price_used = price
                break
            case 'new':
                book.price_new = price
                break
        }
        await book.validate()
        await book.save()
    } catch (e) {
        throw e
    }
}

/**
 * Patch a book
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 */
const patchBook = async (req, res, next) => {
    try {
        if (req.body.stock_used != undefined) {
            await updateStock(req.body.isbn, req.body.stock_used, 'used')
        }
        if (req.body.stock_new != undefined) {
            await updateStock(req.body.isbn, req.body.stock_new, 'new')
        }
        if (req.body.price_used != undefined) {
            await updatePrice(req.body.isbn, req.body.price_used, 'used')
        }
        if (req.body.price_new != undefined) {
            await updatePrice(req.body.isbn, req.body.price_new, 'new')
        }
        res.status(200).json({ updated_book: req.body.isbn })
    } catch (e) {
        next(e)
    }
}

/**
 * Get all books
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find({})
        const output = books.map((book) => {
            return {
                isbn: book.isbn,
                title: book.title,
                authors: book.authors.join(', '),
                publisher: book.publisher,
            }
        })
        return res.status(200).json({ books: output })
    } catch (e) {
        return next(e)
    }
}

/**
 * Get all categories
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getCategories = async (req, res, next) => {
    try {
        var categories = await Book.distinct('category')
        res.status(200).json({ categories: categories })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createBook,
    patchBook,
    getAllBooks,
    getCategories,
}
