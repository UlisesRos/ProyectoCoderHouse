//CART MANAGER CON MONGO

// Importacion del modelo con mongo
const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')

class CartManager {

    async addCart () {

        const cart = await cartModel.create( { products: []} )

        return cart
    }

    async getCartById (id) {

        const cartId = await cartModel.find({_id: id})

        return cartId[0]
    }

    async addProductCart (cid, idProduct) {

        let cart = await cartModel.findOne({_id: cid})
        
        // CREACION DE LOS PRODUCTOS DENTRO DEL CARRITO CON UN ID FALSO

        // const productId = cart.products.find(prod => prod.product == idProduct)
        // if(!productId){
        //     cart.products.push({
        //         product: idProduct,
        //         quantity: 1
        //     })
        // } else {
        //     productId.quantity = productId.quantity + 1
        // }

        // CREACION DE LOS PRODUCTOS DENTRO DEL CARRITO CON EL ID REAL DE LOS PRODUCTOS

        const product = await productModel.findOne({_id: idProduct})

        const p = cart.products.find(pr => pr.product.equals(product._id))

        if(p) {
            p.quantity += 1
        } else {
            cart.products.push({
                product: product._id,
                quantity: 1
            })
        }

        cart = await cart.populate({ path: 'products.product', select: [ 'title', 'price' ] })
        
        await cart.save()

        console.log(cart.products)
    }

}

module.exports = new CartManager()