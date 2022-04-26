const { Schema, model } = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const accountSchema = new Schema({
    role: {
        type: String,
        enum: ['Employee', 'Customer'],
        required: true,
    },
})

accountSchema.plugin(passportLocalMongoose)

module.exports = model('Account', accountSchema)