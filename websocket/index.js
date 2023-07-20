function SocketManager (socket) {
    console.log(`Usuario conectado: ${socket.id}`)

    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
}

module.exports = SocketManager