const router = require('express').Router()

const { BooksHandler } = require('../handlers')

router
    .route('/api/books')
    .post(BooksHandler.createBook)
    .get(BooksHandler.getAllBooks)

router.route('/books/stock_new').patch(BooksHandler.updateStockNew)

router.route('/books/stock_used').patch(BooksHandler.updateStockUsed)

router.route('/books/categories').get(BooksHandler.getCategories)

module.exports = router
