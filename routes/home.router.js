const { Router } = require("express")
const ProductManager = require('./../managers/ProductManager')
const productManager = new ProductManager('./../data/productos.json')
const router = Router()


// rutas de home de HTML

router.get('/', async (req, res) => {

    const products = await productManager.getProducts()

    res.render('home', {
        title: 'Home',
        products,
        style: 'home'
    })
})

router.get('/realtimeproducts', async (req, res) => {

    const products = await productManager.getProducts()

    res.render('realtimeproducts', {
        title: 'Products in Real Time',
        products,
        style: 'realtimeproducts'
    })
})

module.exports = router