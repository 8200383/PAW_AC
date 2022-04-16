const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchaseSchema = new Schema({
    type: {
        type: String,
        enum: ['Web', 'In Store'],
        required: true,
    },
    reader_card_num: {
        type: Number,
        required: true,
    },
    isbn: {
        type: [String], //importar schema do ISBN
        required: true,
    },
    spent_balance: {
        type: Number,
        min: 0,
        required: true,
    },
    payment_method: {
        type: String,
        enum: ['Visa', 'Mastercard', 'Paypal', 'Cash'],
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
    subtotal: {
        type: Number,
        min: 0,
        required: true,
    },
    vat: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    total: {
        type: Number,
        min: 0,
        required: true,
    },
    shipping_method: {
        type: String,
        enum: ['Default', 'Express'],
        required: function () {
            return this.type == 'Web'
        },
    },
    shipping_value: {
        type: Number,
        min: 0,
        required: function () {
            return this.type == 'Web'
        },
    },
    employee_num: {
        type: Number,
        required: function () {
            return this.type == 'In Store'
        },
    },
})

module.exports = mongoose.model('Purchase', purchaseSchema)
