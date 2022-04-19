const express = require('express')
const path = require('path')
const logger = require('morgan')

// Aggregator
const { ConfigAggregator } = require('../aggregators')

// Modules
const Customers = require('../../customers')
const Purchases = require('../../purchases')

// Middlewares
const { errorHandlerMiddleware, notFoundMiddleware } = require('../middlewares')

// Mongoose
const mongoose = require('mongoose')

// Configs
const configs = require('../config')

// Helpers
const { mergeIntoConnectionString } = require('../helpers')

class AppController {

    constructor() {
        this.express = express()

        this.configs()
        this.mongodb()

        this.aggregator = new ConfigAggregator([
            Customers,
            Purchases,
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
            err => console.error(err),
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