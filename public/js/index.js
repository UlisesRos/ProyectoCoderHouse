const socket = io()

function addToCart (productId) {
    socket.emit('productCart', productId)
}

