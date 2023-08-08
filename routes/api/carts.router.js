const { Router } = require('express')
const cartManager = require('../../dao/managersMongo/cart.manager')
const productManager = require('../../dao/managersMongo/product.manager')

const router = Router()

// Creacion de un nuevo CARRITO
router.post('/', async (req, res) => {

    await cartManager.addCart()
    res.status(201).send({Created: 'El carrito fue creado con exito!'})

})

// Leer los productos del carrito con su C-ID

router.get('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        
        const cartId = await cartManager.getCartById( cid )
        if(!cartId){
            res.status(404).send({
                Error: 'ID DE CARRITO INEXISTENTE'
            })
            return
        }

        res.send(cartId)

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrio un error en el sistema'})
    }

})

router.post('/:cid/products/:idProduct', async (req, res) => {
    const { cid, idProduct } = req.params

    try {
        const cartId = await cartManager.getCartById( cid )
        const productId = await productManager.getProductById( idProduct )

        if(!cartId){
            res.status(404).send({
                Error: 'ID DE CARRITO INEXISTENTE'
            })
            return
        }

        if(!productId){
            res.status(404).send({
                Error: 'ID DEL PRODUCTO INEXISTENTE'
            })
            return
        }
        
        await cartManager.addProductCart( cid, idProduct )
        res.status(202).send({Accepted: `Se ha agregado un producto al carrito con id: ${ cid }`})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrio un error en el sistema'})
    }
})

module.exports = router