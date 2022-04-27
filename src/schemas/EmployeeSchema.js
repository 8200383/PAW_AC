const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Validators
const { CellPhoneValidator, PostalCodeValidator, NIFValidator } = require('./validators')

// Enums
const { Gender } = require('./enums')

const employeeSchema = new Schema({
    employee_no: { type: Number, require: true, unique: true },
    name: { type: String, require: true },
    nif: { type: String, validate: NIFValidator },
    cell_phone: { type: String, validate: CellPhoneValidator },
    birth_date: Date,
    gender: { type: String, enum: Gender },
    nationality: String,
    postal_code: { type: String, validate: PostalCodeValidator },
    address: String,
    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Employee', employeeSchema)