const chatMessageManager = require('../dao/managersMongo/chat.message.manager')

async function SocketManager (socket) {
    console.log(`Usuario conectado: ${socket.id}`)

    const userOnline = {}

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
        console.log('Usuario desconectado')
        socket.broadcast.emit('user', {
            user: userOnline[socket.id],
            action: false
    })

    delete userOnline[socket.id] // como borrar la propiedad del objeto
    })
}

module.exports = SocketManager