const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Validators
const { CellPhoneValidator, NIFValidator, PostalCodeValidator } = require('./validators')

// Enums
const { Gender } = require('./enums')

const customerSchema = new Schema({
    reader_card_num: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    cell_phone: { type: String, validate: CellPhoneValidator },
    birth_date: Date,
    gender: { type: String, enum: Gender },
    country: String,
    postal_code: { type: String, validate: PostalCodeValidator },
    billing_address: String,
    residence_address: String,
    nif: { type: String, validate: NIFValidator },
    profession: String,
    accumulated_balance: { type: Number, min: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true}
})

module.exports = mongoose.model('Customer', customerSchema)