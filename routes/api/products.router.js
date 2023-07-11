const { Router } = require('express')
const ProductManager = require('../../managers/ProductManager')

// Creacion de una nueva instancia de la class ProductManager
const productManager = new ProductManager('./../data/productos.json')
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

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const product = await productManager.getProductById(id)

    if(!product){
        res.status(404).send({
            Error: `El producto con el ID: ${id} es inexistente. Pruebe ingresando otro ID`
        })
    }
    else {
        res.send(product)
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
        await productManager.addProduct(body)
        res.status(201).send({Created: `El Producto ${body.title} fue creado con exito`})
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req

    try {
        if(!await productManager.getProductById(id)){
            res.status(404).send({
                Error: 'ID INEXISTENTE'
            })
            return
        }

        await productManager.updateProduct(id, body)
        res.status(202).send({Accepted: `El producto con id: ${id} ha sido modificado.`})
    } catch (error) {
        res.status(500).send({
            message: 'Ha ocurrido un error en el servidor',
            exception: error.stack
        })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    if(!await productManager.getProductById(id)){
        res.status(404).send({
            Error: 'ID INEXISTENTE'
        })
        return
    }

    await productManager.deleteProduct(id)
    res.status(200).send({OK: `El producto con id: ${id} ha sido eliminado.`})
})

module.exports = router