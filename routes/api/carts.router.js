const { Router } = require('express')
const cartManager = require('../../dao/managersMongo/cart.manager')
const productManager = require('../../dao/managersMongo/product.manager')

const router = Router()

// Creacion de un nuevo CARRITO
router.post('/', async (req, res) => {

    await cartManager.addCart()
    res.status(201).send({Created: 'El carrito fue creado con exito!'})

})

router.get('/', async (req, res) => {

    const cart = await cartManager.getCart()
    res.send(cart)

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

router.delete('/:cid/products/:idProduct', async (req, res) => {
    const {cid, idProduct} = req.params

    try {
        const cartId = await cartManager.getCartById( cid )

        if(!cartId){
            res.status(404).send({
                Error: 'ID DE CARRITO INEXISTENTE'
            })
            return
        }

        if(!cartId.products.find(pr => pr.product == idProduct)){
            res.status(404).send({
                Error: 'ID DEL PRODUCTO INEXISTENTE'
            })
            return
        }
    
        await cartManager.deleteProductCart(cid, idProduct)
        res.status(202).send({ Accepted: `Se elimino el producto con id: ${idProduct} del carrito con id: ${cid}`})

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrio un error en el sistema'})
    }
})

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const cartId = await cartManager.getCartById( cid )

        if(!cartId){
            res.status(404).send({
                Error: 'ID DE CARRITO INEXISTENTE'
            })
            return
        }
        
        await cartManager.deleteProductsCart( cid )
        res.status(202).send({ Accepted: `Se eliminaron todos los productos del carrito con id: ${cid}`})

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrio un error en el sistema'})
    }
})
    
router.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const { body } = req

    try {
        const cartId = await cartManager.getCartById( cid )
        if(!cartId){
            res.status(404).send({
                Error: 'ID DE CARRITO INEXISTENTE'
            })
            return
        }
        
        await cartManager.updateCart(cid, body)
        res.status(202).send({ Accepted: `El carrito con id: ${cid} ha sido modificado.` })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrio un error en el sistema'})
    }
})

router.put('/:cid/:product/:idProduct', async (req, res) => {
    const { cid, idProduct } = req.params
    const { body } = req

    try {
        const cartId = await cartManager.getCartById( cid )

        if(!body == { quantity: Number }){
            console.log('Error')
        }
        
        if(!cartId){
            res.status(404).send({
                Error: 'ID DE CARRITO INEXISTENTE'
            })
            return
        }
    
        if(!cartId.products.find(pr => pr.product == idProduct)){
            res.status(404).send({
                Error: 'ID DEL PRODUCTO INEXISTENTE'
            })
            return
        }
    
        await cartManager.updateProductCart(cid, body, idProduct) 
        res.status(202).send({ Accepted: `El producto con id: ${idProduct} del carrito con id: ${cid} ha modificado su cantidad` })

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrio un error en el sistema'})
    }

})

module.exports = router