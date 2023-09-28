const ManagerFactory = require('../../dao/managersMongo/manager.factory')

const cartManager = ManagerFactory.getManagerInstance('carts')
const productManager = ManagerFactory.getManagerInstance('products')
const purchaseManager = ManagerFactory.getManagerInstance('purchases')

const mailSenderService = require('../../services/mail.sender.service')

class CartController {


    // Creacion de un nuevo CARRITO
    async addCart (req, res) {
    
        await cartManager.addCart()
        res.status(201).send({Created: 'El carrito fue creado con exito!'})
    
    }

    // Mostrar todos los carritos
    async getCart (req, res) {

        const cart = await cartManager.getCart()
        res.send(cart)
    
    }

    // Leer los productos del carrito con su C-ID
    async getCartById (req, res) {
        const { cid } = req.params
    
        try {
            
            const cartId = await cartManager.getCartById( cid )
            if(!cartId){
                res.status(404).send({
                    Error: 'ID DE CARRITO INEXISTENTE'
                })
                return
            }
    
            res.send(cartId)
    
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    
    }

    // Agregar productos a los carritos
    async addProductCart (req, res) {
        const { cid, idProduct } = req.params
    
        try {
            const cartId = await cartManager.getCartById( cid )
            const productId = await productManager.getProductById( idProduct )
    
            if(!cartId){
                res.status(404).send({
                    Error: 'ID DE CARRITO INEXISTENTE'
                })
                return
            }
    
            if(!productId){
                res.status(404).send({
                    Error: 'ID DEL PRODUCTO INEXISTENTE'
                })
                return
            }
            
            await cartManager.addProductCart( cid, idProduct )
            res.status(202).send({Accepted: `Se ha agregado un producto al carrito con id: ${ cid }`})
            
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    }

    // Eliminar producto dentro del carrito
    async deleteProductCart (req, res) {
        const {cid, idProduct} = req.params
    
        try {
            const cartId = await cartManager.getCartById( cid )
    
            if(!cartId){
                res.status(404).send({
                    Error: 'ID DE CARRITO INEXISTENTE'
                })
                return
            }
    
            if(!cartId.products.find(pr => pr.product == idProduct)){
                res.status(404).send({
                    Error: 'ID DEL PRODUCTO INEXISTENTE'
                })
                return
            }
        
            await cartManager.deleteProductCart(cid, idProduct)
            res.status(202).send({ Accepted: `Se elimino el producto con id: ${idProduct} del carrito con id: ${cid}`})
    
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    }

    // Eliminar carrito
    async deleteCart (req, res) {
        const { cid } = req.params
    
        try {
            const cartId = await cartManager.getCartById( cid )
    
            if(!cartId){
                res.status(404).send({
                    Error: 'ID DE CARRITO INEXISTENTE'
                })
                return
            }
            
            await cartManager.deleteProductsCart( cid )
            res.status(202).send({ Accepted: `Se eliminaron todos los productos del carrito con id: ${cid}`})
    
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    }

    // Modificar carrito
    async updateCart (req, res) {
        const { cid } = req.params
        const { body } = req
    
        try {
            const cartId = await cartManager.getCartById( cid )
            if(!cartId){
                res.status(404).send({
                    Error: 'ID DE CARRITO INEXISTENTE'
                })
                return
            }
            
            await cartManager.updateCart(cid, body)
            res.status(202).send({ Accepted: `El carrito con id: ${cid} ha sido modificado.` })
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    }

    // Modificar producto dentro del carrito
    async updateProductCart (req, res) {
        const { cid, idProduct } = req.params
        const { body } = req
    
        try {
            const cartId = await cartManager.getCartById( cid )
    
            if(!body == { quantity: Number }){
                console.log('Error')
            }
            
            if(!cartId){
                res.status(404).send({
                    Error: 'ID DE CARRITO INEXISTENTE'
                })
                return
            }
        
            if(!cartId.products.find(pr => pr.product == idProduct)){
                res.status(404).send({
                    Error: 'ID DEL PRODUCTO INEXISTENTE'
                })
                return
            }
        
            await cartManager.updateProductCart(cid, body, idProduct) 
            res.status(202).send({ Accepted: `El producto con id: ${idProduct} del carrito con id: ${cid} ha modificado su cantidad` })
    
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    
    }

    // ORDENES DE COMPRA
    // Crear la orden de compra
    async addOrderCart (req, res) {
        const { cid } = req.params

    // Ejecutamos un metodo para crear la orden de compra

        let cart = await cartManager.getCartById(cid)

        if(!cart) {
            return res.sendStatus(404)
        }

        const { products: productsInCart } = cart
        const products = [] 
        const productsDelete = []

        for (const { product: id, quantity } of productsInCart) {
            // Chequeo el Stock
            
            const p = await productManager.getProductById(id)

            if(!p.stock){
                return
            }

            const toBuy = p.stock >= quantity ? quantity : p.stock

            products.push({
                id: p._id,
                price: p.price,
                quantity: toBuy
            })
            
            // Array de productos que no pudieron comprarse
            if(quantity > p.stock){
                productsDelete.push({
                    id: p._id,
                    unPurchasedQuantity: quantity - p.stock
                })
            } 
            
            // Actualizacion del carrito de compras
            if(p.stock > quantity){
                await cartManager.deleteProductsCart(cid)
            }
            
            // Actualizamos el Stock
            p.stock = p.stock - toBuy
            
            await p.save()
            
        }

        // Dejar el carrito de compras con los productos que no pudieron comprarse. 
        for(const { id, unPurchasedQuantity } of productsDelete) {
            await cartManager.addProductCart(cid, id)
            await cartManager.updateProductCart(cid, {quantity: unPurchasedQuantity}, id)
        }

        cart = await cart.populate({ path: 'user', select: [ 'email', 'first_name', 'last_name' ] })

        //FECHA
        const today = new Date()
        const hoy = today.toLocaleString()

        const order = {
            user: cart.user._id,
            code: Date.now(),
            total: products.reduce((total, { price, quantity }) => (price * quantity) + total, 0),
            products: products.map(({ id, quantity }) => {
                return {
                    product: id,
                    quantity
                }
            }),
            purchaser: cart.user.email,
            purchaseDate: hoy
        }

        purchaseManager.addOrder(order)

        // Envio de Ticket al mail

        const template = `
            <h2>¡Hola ${cart.user.first_name}!</h2>
            <h3>Tu compra fue realizada con exito. Aqui te dejamos el ticket de compra.</h3>
            <br>
            <div style="border: solid 1px black; width: 310px;">
                <h3 style="font-weight: bold; color: black; text-align: center;">Comprobante de Compra</h3>
                <ul style="list-style: none; color: black; font-weight: 500;">
                    <li>Nombre y Apellido: ${cart.user.first_name}, ${cart.user.last_name}</li>
                    <li>Codigo: ${order.code}</li>
                    <li>Catidad de Productos Comprados: ${order.products.length}</li>
                    <li>Total: $ ${order.total}</li>
                    <li>Fecha: ${order.purchaseDate}</li>
                </ul>
            </div>

            <h3>¡Muchas gracias, te esperamos pronto!</h3>
        `

        mailSenderService.send(order.purchaser, template)

        res.status(202).send(
            {
                Accepted: `!Felicitaciones ha finalizado su compra!. Orden enviada por mail`,
                unPurchasedProducts: productsDelete
            })

    }

    // Mostrar todas las ordenes de compra

    async getOrders (req, res) {

        const orders = await purchaseManager.getOrders()

        res.send(orders)
    }

    // Mostrar la orden por ID
    async getOrderById (req, res) {
        const { id } = req.params

        try {
            
            const order = await purchaseManager.getOrderById(id)
            if(!order){
                res.status(404).send({
                    Error: 'ID DE LA ORDEN INEXISTENTE'
                })
                return
            }
    
            res.send(order)
    
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    }

    // Eliminar una orden de compra
    async deleteOrder (req, res) {
        const { id } = req.params

        try {
            
            const order = await purchaseManager.getOrderById(id)
            if(!order){
                res.status(404).send({
                    Error: 'ID DE LA ORDEN INEXISTENTE'
                })
                return
            }
    
            await purchaseManager.deleteOrder(id)
            res.status(202).send({Accepted: `Se ha eliminado con exito la orden con id: ${id}`})
    
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    }

}

module.exports = new CartController()