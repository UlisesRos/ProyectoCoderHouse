const { Router } = require('express')
const ProductRouter = require('./api/products.router')
const CartRouter = require('./api/carts.router')
const HomeRouter = require('./home.router')


// api
const router = Router()

// ruta de productos
router.use('/products', ProductRouter)

// ruta del carrito
router.use('/carts', CartRouter)


module.exports = {
    api: router,
    home: HomeRouter
}