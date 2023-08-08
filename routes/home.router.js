const { Router } = require("express")
const productManager = require('../dao/managersMongo/product.manager')
const router = Router()


// rutas de home de HTML

router.get('/', async (req, res) => {

    const products = await productManager.getProducts()

    res.render('home', {
        title: 'Home',
        user: {
            ...req.user,
            isAdmin: req.user.role == 'Admin'
        },
        products,
        style: 'home'
    })
})

router.get('/realtimeproducts', async (req, res) => {

    const products = await productManager.getProducts()

    res.render('realtimeproducts', {
        title: 'Products in Real Time',
        user: {
            ...req.user,
            isAdmin: req.user.role == 'Admin'
        },
        products,
        style: 'realtimeproducts'
    })
})

router.get('/chatmessage', async (req, res) => {

    res.render('chatmessage', {
        title: 'Chat',
        user: {
            ...req.user,
            isAdmin: req.user.role == 'Admin'
        },
        style: 'chatmessage'
    })

})

module.exports = router