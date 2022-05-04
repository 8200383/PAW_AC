const mongoose = require('mongoose')
const Schema = mongoose.Schema

const isOnlinePurchase = (type) => {
    return type === 'Web'
}

const arrayMin = (books) => {
    return books.length > 0
}

const bookSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    type: {
        type: String,
        enum: ['Used', 'New'],
        required: true,
    },
    qnt: {
        type: Number,
        required: true,
    },
})

const purchaseSchema = new Schema({
    type: {
        type: String,
        enum: ['Web', 'In Store'],
        required: true,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    books: {
        type: [
            {
                type: bookSchema,
                required: true,
            },
        ],
        validate: [arrayMin, 'The purchase should have at least one book'],
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
        required: isOnlinePurchase(this.type),
    },
    shipping_value: {
        type: Number,
        min: 0,
        required: isOnlinePurchase(this.type),
    },
    employee_num: {
        type: Number,
        required: !isOnlinePurchase(this.type),
    },
})

module.exports = mongoose.model('Purchase', purchaseSchema)
