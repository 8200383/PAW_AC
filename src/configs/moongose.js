const mongoose = require('mongoose')
const connectionOptions = require('./connection.json')
const { mergeIntoConnectionString } = require('../helpers')

const connection = mongoose.connect(
    mergeIntoConnectionString(connectionOptions),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
)

//mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)

module.exports = connection