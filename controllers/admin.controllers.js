const productManager = require('../dao/managersMongo/product.manager')
const cartManager = require('../dao/managersMongo/cart.manager')

class AdminController {

    async getAdmin (req, res) {

        const cart = await cartManager.getCartById(req.user.cart._id)
    
        res.render('admin/admin', {
            title: 'Agregar un nuevo producto',
            style: 'admin',
            user: req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin'
            } : null,
            idCart: cart._id
        })
    
    }

    // Creacion de un nuevo producto solo por el ADMIN
    async addProductAdmin (req, res) {

        await productManager.addProduct(req.body)
    
        res.redirect('/admin/admin')
    }
}

module.exports = new AdminController()