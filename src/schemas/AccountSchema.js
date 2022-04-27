const { Schema, model } = require('mongoose')

const accountSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Employee', 'Customer'],
        required: true,
    },
})

module.exports = model('Account', accountSchema)