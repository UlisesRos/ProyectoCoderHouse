const { Schema, model } = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const shema = new Schema({
    status: { type: Boolean, default: true},
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: {type: Number, default: 0},
    category: String,
    thumbnail: {type: [String], default: []},
})

shema.plugin(paginate)

const productModel = model('products', shema)

module.exports = productModel