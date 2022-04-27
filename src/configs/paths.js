const path = require('path')
const express = require('express')

module.exports = framework => {
    framework.set('views', path.join(__dirname, '../views'))
    framework.set('view engine', 'ejs')
    framework.use(express.static(path.join(__dirname, '../../public')))
}