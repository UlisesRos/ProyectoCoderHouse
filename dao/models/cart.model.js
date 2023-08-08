const { Schema, model } = require('mongoose')

const schema = new Schema({
    products: {
        type: [{
            // product: String --> Creacion de los productos dentro del carrito con un ID falso
            product: {type: Schema.Types.ObjectId, ref: 'products'},
            quantity: {type: Number, default: 0}
        }], 
    default: []
}
})

const cartModel = model('carts', schema)

module.exports = cartModel