const ProductManager = require('../managers/ProductManager')
const CartManager = require('../managers/CartManager')
const productManager = new ProductManager('./../data/productos.json')
const cartManager = new CartManager('./../data/carrito.json')

module.exports = {

    usuarioAut (req, res, next) {
        req.user = {
            name: 'Ulises Ros',
            role: 'Admin'
        }

        next()
    },
    
    async idInex (req, res, next) {
    
        const { pid } = req.params
    
        const productID = await productManager.getProductById(pid)
    
        if(!productID){
            res.status(404).send({
                Error: 'ID INEXISTENTE'
            })
        }
    
        next()
    },

    async cartIdInex (req, res, next) {
    
        const { cid } = req.params
    
        const cartID = await cartManager.getCartById(cid)
    
        if(!cartID){
            res.status(404).send({
                Error: 'ID DE CARRITO INEXISTENTE'
            })
        }
    
        next()
    }
}