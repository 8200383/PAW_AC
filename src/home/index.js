const path = require('path')

module.exports = {
    name: 'Home',
    views: path.join(__dirname, 'views'),
    routes: require('./routes.js'),
}