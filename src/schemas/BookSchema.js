const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
    isbn: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: [String],
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    published_date: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    maturaty_rating: {
        type: String,
        required: false,
    },
    criticism: {
        type: Number,
        required: false
    },
    stock_new: {
        type: Number,
        min: 0,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
    stock_used: {
        type: Number,
        min: 0,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
    price_new: {
        type: Number,
        min: 0,
        required: true,
    },
    price_used: {
        type: Number,
        min: 0,
        required: true,
    },
    images: {
        small_thumbnail: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
})

module.exports = mongoose.model('Book', bookSchema)
