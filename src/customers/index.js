const path = require('path')

module.exports = {
    name: 'Customers',
    views: path.join(__dirname, 'views'),
    routes: require('./routes'),
    swagger: path.join(__dirname, 'routes.js')
}