const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
    reader_card_num: Number,
    name: String,
    cell_phone: Number,
    birth_date: Date,
    gender: ['Male', 'Female', 'Non Binary'],
    country: String,
    postal_code: String,
    location: String,
    billing_address: String,
    residence_address: String,
    nif: Number,
    profession: String,
    accumulated_balance: Number,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Customer', customerSchema)