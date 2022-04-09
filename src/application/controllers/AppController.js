const express = require('express')
const path = require('path')
const logger = require('morgan')

// Modules
const customers = require('../../customers')

// Middlewares
const errorHandlerMiddleware = require('../middlewares/ErrorHandlerMiddleware')
const notFoundMiddleware = require('../middlewares/NotFoundMiddleware')

class AppController {

    constructor() {
        this.express = express()

        this.views()
        this.configs()
        this.routes()
        this.middlewares()
    }

    views() {
        this.express.set('views', [
            customers.views
        ])

        this.express.set('view engine', 'ejs')
        this.express.use(express.static(path.join(__dirname, 'public')))
    }

    configs() {
        this.express.use(logger('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
    }

    routes() {
        this.express.use(customers.routes)
    }

    middlewares() {
        this.express.route('*').get(notFoundMiddleware)
        this.express.use(errorHandlerMiddleware)
    }
}

module.exports = new AppController().express