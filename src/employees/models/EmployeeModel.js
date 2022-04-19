const mongoose = require('mongoose')
const { string } = require('joi')

const Schema = mongoose.Schema

/**
 * Validate cell phone
 * @param {string} cellPhone
 * @returns {Promise<*>}
 */
const validateCellPhone = async (cellPhone) => {
    return new Promise((resolve, reject) => {
        const expression = /^\d{9}$/
        const match = cellPhone.match(expression)

        if (match === null) {
            return reject(new Error('Must be 9 digits'))
        }

        return resolve(true)
    })
}

const employeeSchema = new Schema({
    employee_no: { type: Number, require: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
    cell_phone: { type: String, validate: validateCellPhone },
    birthDate: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Non Binary'] },
    nationality: String,
    postal_code: String,
    address: String,
    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Employee', employeeSchema)