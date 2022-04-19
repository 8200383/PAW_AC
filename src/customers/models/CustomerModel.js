const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
    reader_card_num: Number,
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cell_phone: Number,
    birth_date: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Non Binary'] },
    country: String,
    postal_code: String,
    location: String,
    billing_address: String,
    residence_address: String,
    nif: { type: Number, min: 0, max: 10 },
    profession: String,
    accumulated_balance: Number,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Customer', customerSchema)