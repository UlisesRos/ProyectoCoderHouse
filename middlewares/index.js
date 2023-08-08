const productManager = require('../dao/managersMongo/product.manager')
const CartManager = require('../dao/managers/CartManager')
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