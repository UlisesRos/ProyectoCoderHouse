const { Schema, model } = require('mongoose')

//FECHA
const today = new Date()
const hoy = today.toLocaleString()

const schema = new Schema({
    first_name: String,
    last_name: {type: String, index: true},
    email: { type: String, index: true},
    role: {type: String, default: 'Customer'},
    age: Number,
    password: String,
    cart: { type: Schema.Types.ObjectId, ref: 'carts' },
    documents: {
        type: [{
            name: String,
            reference: String,
            tipo: String
        }],
        default: []
    },
    last_connection: { type: String, default: `Connect ${hoy}` }
})

const userModel = model('users', schema)

module.exports = userModel