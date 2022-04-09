const path = require('path')

module.exports = {
    views: path.join(__dirname, 'views'),
    routes: require('./routes'),
}