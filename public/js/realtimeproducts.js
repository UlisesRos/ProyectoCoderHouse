console.log('Bienvenidos a WebSocket')

const d = document

const socket = io()

const listProducts = d.getElementById('list-products')

// CREACION del producto a treves de la peticion POST
socket.on('addProduct', (product, id) => {

    const div = d.createElement('div')
    div.setAttribute('id', id)
    div.innerHTML = `<div class="uk-card uk-card-default uk-card-hover uk-border-rounded">
                            <div class="uk-card-media-top">
                                <img alt="foto producto" />
                            </div>
                            <div class="uk-card-body">
                                <h3 class="uk-card-title">${product.title}</h3>
                                <h5>$${product.price}</h5>
                                <p>${product.description}</p>
                                <p>${product.stock}</p>
                                <p>${product.category}</p>
                                <button class="uk-button uk-button-secondary uk-button-small uk-border-rounded">Agregar al carrito</button>
                            </div>
                    </div>`

    listProducts.appendChild(div)
})


// ELIMINACION del producto a treves de la peticion DELETE
socket.on('deleteProduct', (pid) => {
    const p = pid.toString()
    const div = d.getElementById(p)

    listProducts.removeChild(div)
})

