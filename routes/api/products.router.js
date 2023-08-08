const { Router } = require('express')
const productManager = require('../../dao/managersMongo/product.manager')

const router = Router()

router.get('/', async (req, res) => {
    const { limit } = req.query
    const products = await productManager.getProducts()

    let filtrados = []

    if(limit) {
        if(limit > products.length){
            res.send(products)
        } else {
            for(let i = 0; i < limit; i++){
                filtrados.push(products[i])
            }
    
            res.send(filtrados)
        }
    }
    else{
        res.send(products)
    }

})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params

    try {

        const product = await productManager.getProductById(pid)
        
        if(!product){
            res.status(404).send({
                Error: 'ID INEXISTENTE'
            })
        }
        res.send(product)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrio un error en el servidor'})
    }

})

router.post('/', async (req, res) => {
    const { body } = req

    const product = await productManager.getProducts()
    
    if(!body.title || !body.description || !body.price || !body.category || !body.code || !body.stock){
        res.status(400).send({
            Error: 'todos los campos son obligatorios'
        })
    } else if (product.find(prod => prod.title == body.title || prod.code == body.code)) {
        res.status(400).send({
            Error: 'title o code ya existe'
        })
    } else {
        req.io.emit('addProduct', body);
        await productManager.addProduct(body)
        res.status(201).send({Created: `El Producto ${body.title} fue creado con exito`})
    }
    
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const { body } = req

    try {
        
        const result = await productManager.updateProduct(pid, body)
        if(result.matchedCount >= 1){
            res.status(202).send({Accepted: `El producto con id: ${pid} ha sido modificado.`})
            return
        }
        
        res.status(404).send({
            Error: 'ID INEXISTENTE'
        })

    } catch (error) {

        res.status(500).send({
            message: 'Ha ocurrido un error en el servidor',
            exception: error.stack
        })
    }

})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    
    try {
        
        const productId = await productManager.getProductById( pid )

        req.io.emit('deleteProduct', productId.code)

        const result = await productManager.deleteProduct(pid)
        if (result.deletedCount >= 1) {
            res.status(200).send({OK: `El producto con id: ${pid} ha sido eliminado.`})
            return
        }
        
        res.status(404).send({
            Error: 'ID INEXISTENTE'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Ocurrio un error en el servidor'})
    }
    
})

module.exports = router