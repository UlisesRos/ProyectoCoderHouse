const { Router } = require('express')
const CartManager = require('../../managers/CartManager')
const { cartIdInex } = require('../../middlewares')

// Creacion de una nueva instancia de CARTMANAGER
const cartManager = new CartManager('./../data/carrito.json')
const router = Router()

// Creacion de un nuevo CARRITO
router.post('/', async (req, res) => {

    await cartManager.addCart()
    res.status(201).send({Created: 'El carrito fue creado con exito!'})

})

// Leer los productos del carrito con su C-ID

router.get('/:cid', cartIdInex, async (req, res) => {
    const { cid } = req.params
    const cartId = await cartManager.getCartById(cid)

    res.send(cartId)
})

router.post('/:cid/products/:id', cartIdInex, async (req, res) => {
    const { cid, id } = req.params

    await cartManager.addProductCart(cid, id)
    res.status(202).send({Accepted: `Se ha agregado un producto al carrito con id: ${cid}`})
})

module.exports = router