const mongoose = require('mongoose');
const connectionOptions = require('./connection.json')
const { mergeIntoConnectionString } = require('../helpers')

mongoose.connect(mergeIntoConnectionString(connectionOptions), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.info("MongoDB Connected"))
    .catch((e) => console.error(e));

mongoose.set("useCreateIndex", true);