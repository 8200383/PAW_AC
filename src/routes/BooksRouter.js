const router = require('express').Router()

const { BooksHandler } = require('../handlers')

router
    .route('/api/books')
    .post(BooksHandler.createBook)
    .get(BooksHandler.getAllBooks)
    .patch(BooksHandler.patchBook)

router.route('/api/book/:isbn')
    .get(BooksHandler.getBook)

router.route('/api/books/categories').get(BooksHandler.getCategories)

module.exports = router
