const { Router } = require('express')
const ProductRouter = require('./api/products.router')
const CartRouter = require('./api/carts.router')
const HomeRouter = require('./home.router')
const UserRouter = require('./api/user.router')
const LoginRouter = require('./login.router')
const ChatRouter = require('./chat.router')
const AdminRouter = require('./admin.router')

// api
const router = Router()

// ruta de productos
router.use('/products', ProductRouter)

// ruta del carrito
router.use('/carts', CartRouter)

// ruta del usuario
router.use('/users', UserRouter)

// home
const home = Router()

// ruta del home
home.use('/', HomeRouter)

// ruta del login
home.use('/', LoginRouter)

// ruta del chat
home.use('/chatmessage', ChatRouter)

// ruta del admin
home.use('/admin', AdminRouter)


module.exports = {
    api: router,
    home
}