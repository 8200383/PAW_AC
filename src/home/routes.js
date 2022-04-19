const router = require('express').Router()

const { HomeController } = require('./controllers')

router
    .route('/')
    .get(HomeController.index)

module.exports = router
