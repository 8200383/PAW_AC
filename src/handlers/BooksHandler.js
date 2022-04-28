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
            let schema = await createSchema(
                req.body.isbn,
                req.body.stock_new,
                req.body.stock_used,
                book
            )
            await addBook(schema)
            res.status(200).json({ added_book: schema })
        })
        .catch((e) => {
            next(e)
        })
}

/**
 * Create book schema with google books api
 *
 * @param {String} isbn
 * @param {Number} stockNew
 * @param {Number} stockUsed
 * @param {Object} book
 * @returns {Promise<Object>}
 */
const createSchema = async (isbn, stockNew, stockUsed, book) => {
    return {
        isbn: isbn,
        title: book.title,
        authors: book.authors,
        publisher: book.publisher,
        published_date: book.publishedDate,
        language: book.language,
        pages: book.pageCount,
        description: book.description,
        category: book.categories[0],
        maturaty_rating: book.maturityRating,
        stock_new: stockNew,
        stock_used: stockUsed,
        images: {
            small_thumbnail: book.imageLinks.smallThumbnail,
            thumbnail: book.imageLinks.thumbnail,
        },
    }
}

/**
 * Adds a Book to the data base
 *
 * @param {Object} schema
 * @returns {Promise<void>}
 */
const addBook = async (schema) => {
    var book = null

    try {
        book = new Book(schema)
        await book.validate()
        await book.save()
    } catch (e) {
        throw e
    }
}

/**
 * Update book new stock
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const updateStockNew = async (req, res, next) => {
    var book = null

    try {
        book = await Book.findOne({
            isbn: req.body.isbn,
        })

        book.stock_new = req.body.stock
        await book.validate()
        await book.save()
        res.status(200).json({ updated_book: req.body.isbn })
    } catch (e) {
        next(e)
    }
}

/**
 * Update book used stock
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const updateStockUsed = async (req, res, next) => {
    var book = null

    try {
        book = await Book.findOne({
            isbn: req.body.isbn,
        })

        book.stock_used = req.body.stock
        await book.validate()
        await book.save()
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
    var books = null

    try {
        books = await Book.find({})
        res.status(200).json({ books: books })
    } catch (e) {
        next(e)
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
    var categories = null

    try {
        categories = await Book.distinct('category')
        res.status(200).json({ categories: categories })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createBook,
    updateStockNew,
    updateStockUsed,
    getAllBooks,
    getCategories,
}
