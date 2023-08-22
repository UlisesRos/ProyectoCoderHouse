const { Router } = require('express')
const productManager = require('./../dao/managersMongo/product.manager')
const cartManager = require('./../dao/managersMongo/cart.manager')

const router = Router()

router.get('/admin', async (req, res) => {

    const cart = await cartManager.getCart()

    res.render('admin/admin', {
        title: 'Agregar un nuevo producto',
        style: 'admin',
        user: req.user ? {
            ...req.user,
            isAdmin: req.user.role == 'admin'
        } : null,
        idCart: cart[0]._id
    })

})

router.post('/admin', async (req, res) => {

    await productManager.addProduct(req.body)

    res.redirect('/admin/admin')
})

module.exports = router