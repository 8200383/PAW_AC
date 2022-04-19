const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Validators
const { CellPhoneValidator, NIFValidator, PostalCodeValidator } = require('../../shared/validators')

// Enums
const { Gender } = require('../../shared/enums')

const customerSchema = new Schema({
    reader_card_num: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    cell_phone: { type: String, validate: CellPhoneValidator },
    birth_date: Date,
    gender: { type: String, enum: Gender },
    country: String,
    postal_code: { type: String, validate: PostalCodeValidator },
    location: String,
    billing_address: String,
    residence_address: String,
    nif: { type: String, validate: NIFValidator },
    profession: String,
    accumulated_balance: { type: Number, min: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Customer', customerSchema)