const path = require('path')

module.exports = {
    name: 'Purchases',
    views: path.join(__dirname, 'views'),
    routes: require('./routes.js'),
    swagger: path.join(__dirname, 'swagger.json')
}