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

// Swagger
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

class AppController {

    constructor() {
        this.express = express()

        this.configs()

        this.aggregator = new ConfigAggregator([
            Customers,
        ])

        // Call after aggregator
        this.views()
        this.swagger()
        this.routes()

        this.errorHandling()
    }

    configs() {
        this.express.use(logger('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
    }

    views() {
        this.express.set('views', this.aggregator.getMergedViews())
        this.express.set('view engine', 'ejs')
        this.express.use(express.static(path.join(__dirname, 'public')))
    }

    swagger() {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'PAW Swagger Docs',
                    version: 'v1beta1',
                },
            },
            apis: this.aggregator.getMergedApiSpecifications(),
        }

        const openapiSpecification = swaggerJsDoc(options)
        const swaggerUrl = '/'

        this.express.use(swaggerUrl, swaggerUI.serve)
        this.express.get(swaggerUrl, swaggerUI.setup(openapiSpecification))
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