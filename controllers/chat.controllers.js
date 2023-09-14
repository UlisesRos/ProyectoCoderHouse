const cartManager = require('../dao/managersMongo/cart.manager')

class CartController {

    async getChat (req, res) {

        const cart = await cartManager.getCartById(req.user.cart._id)
    
        res.render('chatmessage', {
            title: 'Chat',
            user: {
                ...req.user,
                isAdmin: req.user.role == 'admin'
            },
            idCart: cart._id,
            style: 'chatmessage'
        })
    
    }

}

module.exports = new CartController()