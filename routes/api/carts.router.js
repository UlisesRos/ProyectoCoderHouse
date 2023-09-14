const { Router } = require('express')
const cartController = require('../../controllers/apiControllers/carts.controllers')

const router = Router()

// Creacion de un nuevo CARRITO
router.post('/', cartController.addCart)

router.get('/', cartController.getCart)

// Leer los productos del carrito con su C-ID

router.get('/:cid', cartController.getCartById)

router.post('/:cid/products/:idProduct', cartController.addProductCart)

router.delete('/:cid/products/:idProduct', cartController.deleteProductCart)

router.delete('/:cid', cartController.deleteCart)
    
router.put('/:cid', cartController.updateCart)

router.put('/:cid/:product/:idProduct', cartController.updateProductCart)

module.exports = router