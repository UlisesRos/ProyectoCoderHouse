const ManagerFactory = require('../dao/managersMongo/manager.factory')

const chatMessageManager = ManagerFactory.getManagerInstance('chatMessages')
const cartManager = ManagerFactory.getManagerInstance('carts')
const productManager = ManagerFactory.getManagerInstance('products')

async function SocketManager (socket) {

    const userOnline = {}

    // Carrito de compras
    socket.on('productCart', (cartId) => {
        const cartAndProductId = cartId.split(",")

        cartManager.addProductCart(cartAndProductId[0], cartAndProductId[1])
    })

    // Elimnar producto del carrito de compras
    socket.on('deleteProductCart', (productId) => {
        const cartAndProductId = productId.split(",")
        cartManager.deleteProductCart(cartAndProductId[0], cartAndProductId[1])

    })

    // Eliminar producto por el ADMIN
    socket.on('deleteProduct', (productId) => {
        
        productManager.deleteProduct(productId)

    })

    // logica de los mensajes
    // obtengo todos los mensajes de la base de datos

    const messages = await chatMessageManager.getMessages()

    socket.emit('chat-messages', messages)

    socket.on('chat-message', async (msg) => {
        
        // guardamos los mensajes en la DB

        await chatMessageManager.addMessage(msg)
        socket.broadcast.emit('chat-message', msg)
    })

    socket.on('user', ({ user, action }) => {
        userOnline[socket.id] = user
        socket.broadcast.emit('user', { user, action })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user', {
            user: userOnline[socket.id],
            action: false
    })

    delete userOnline[socket.id] // como borrar la propiedad del objeto
    })
}

module.exports = SocketManager