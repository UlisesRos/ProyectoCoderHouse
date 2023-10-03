const ManagerFactory = require('../dao/managersMongo/manager.factory')

const cartManager = ManagerFactory.getManagerInstance('carts')

function policiesCustomer (req, res, next) {

    if(req.user.role !== 'Customer') {
        return res.status(401).send({
            error: "Not a valid user"
        })
    }

    next()
}

function policiesAdmin (req, res, next) {

    if(req.user.role !== 'admin') {
        return res.status(401).send({
            error: "Not a valid user"
        })
    }

    next()
}

async function productsOutOfStock (req, res, next) {

    const user = req.user

    const cart = await cartManager.getCartById(user.cart)

    if(!cart.products.length){
        return res.status(404).send({
            error: 'El carrito de compras se encuentra vacio. Agrega productos a tu carrito.'
        })
    }

    next()
}


module.exports = {
    policiesAdmin,
    policiesCustomer,
    productsOutOfStock
}