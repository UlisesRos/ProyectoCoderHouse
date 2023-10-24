const ManagerFactory = require('../dao/managersMongo/manager.factory')

const productManager = ManagerFactory.getManagerInstance('products')
const cartManager = ManagerFactory.getManagerInstance('carts')

class AdminController {

    async getAdmin (req, res) {

        const cart = await cartManager.getCartById(req.user.cart._id)
    
        res.render('admin/admin', {
            title: 'Agregar un nuevo producto',
            style: 'admin',
            user: req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin',
                isPublic: req.user.role == 'Customer',
                isPremium: req.user.role == 'Premium'
            } : null,
            idCart: cart._id
        })
    
    }
    
    async getAdminEditarProducto (req, res) {

        res.render('admin/editarProducto', {
            title: 'Editar un producto',
            style: 'admin',
            user: req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin',
                isPublic: req.user.role == 'Customer',
                isPremium: req.user.role == 'Premium'
            } : null
        })
    }

    // Creacion de un nuevo producto solo por el ADMIN
    async addProductAdmin (req, res) {
        if(req.user.role == 'Premium'){
            await productManager.addProduct({
                ...req.body,
                owner: req.user.email
            })

            res.redirect('/admin/admin')
        } else {
            await productManager.addProduct(req.body)
        
            res.redirect('/admin/admin')
        }
    }

    // Editar un producto existente solo por el ADMIN
    async updateProductAdmin (req, res) {

        const {id, ...body} = req.body

        productManager.updateProduct(id, body)

        res.redirect('/')

    }
}

module.exports = new AdminController()