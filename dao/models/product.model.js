const { Schema, model } = require('mongoose')

const shema = new Schema({
    status: { type: Boolean, default: true},
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnail: {type: [String], default: []},
})

const productModel = model('products', shema)

module.exports = productModel