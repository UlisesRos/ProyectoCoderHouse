const { Schema, model } = require('mongoose')

const schema = new Schema({
    first_name: String,
    last_name: {type: String, index: true},
    email: { type: String, index: true},
    role: {type: String, default: 'Customer'},
    age: Number,
    password: String,
    cart: { type: Schema.Types.ObjectId, ref: 'carts' }
})

const userModel = model('users', schema)

module.exports = userModel