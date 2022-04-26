const logger = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')

module.exports = framework => {
    framework.use(logger('dev'))
    framework.use(express.json())
    framework.use(express.urlencoded({ extended: false }))
    framework.use(cookieParser())
}