const express = require('express')
const path = require('path')
const logger = require('morgan')

// Aggregator
const ConfigAggregator = require('../aggregators/ConfigAggregator')

// Modules
const Customers = require('../../customers')

// Middlewares
const errorHandlerMiddleware = require('../middlewares/ErrorHandlerMiddleware')
const notFoundMiddleware = require('../middlewares/NotFoundMiddleware')

// Mongoose
const mongoose = require('mongoose')

// Configs
const configs = require('../config')

// Helpers
const mergeIntoConnectionString = require('../helpers/mergeIntoConnectionString')

class AppController {

    constructor() {
        this.express = express()

        this.configs()
        this.mongodb()

        this.aggregator = new ConfigAggregator([
            Customers,
        ])

        // Call after aggregator
        this.views()
        this.routes()

        this.errorHandling()
    }

    configs() {
        this.express.use(logger('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
    }

    mongodb() {
        mongoose.connect(mergeIntoConnectionString(configs.mongo)).then(
            () => console.info('Mongo connection is ready!'),
            err => console.error(err)
        )
    }

    views() {
        this.express.set('views', this.aggregator.getMergedViews())
        this.express.set('view engine', 'ejs')
        this.express.use(express.static(path.join(__dirname, 'public')))
    }

    routes() {
        this.aggregator.getMergedRoutes().map((route) => this.express.use(route))
    }

    errorHandling() {
        this.express.get('*', notFoundMiddleware)
        this.express.use(errorHandlerMiddleware)
    }
}

module.exports = new AppController().express