const { Router } = require('express')
const cartManager = require('./../dao/managersMongo/cart.manager')

const router = Router()

router.get('/', async (req, res) => {

    const cart = await cartManager.getCart()

    res.render('chatmessage', {
        title: 'Chat',
        user: {
            ...req.user,
            isAdmin: req.user.role == 'Admin'
        },
        idCart: cart[0]._id,
        style: 'chatmessage'
    })

})

module.exports = router