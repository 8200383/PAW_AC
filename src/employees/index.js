const path = require('path')

module.exports = {
    name: 'Employees',
    views: path.join(__dirname, 'views'),
    routes: require('./routes.js'),
    swagger: path.join(__dirname, 'swagger.json')
}