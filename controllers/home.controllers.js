const productManager = require('../dao/managersMongo/product.manager')
const cartManager = require('../dao/managersMongo/cart.manager')

class HomeController {

    // Rutas del home 
    async getHome (req, res) {

        let { query, page, limit, sort } = req.query
    
        if(sort == 'asc'){
            sort = 1
        } else if( sort == 'desc'){
            sort = -1
        }
    
        if(query){
            if (!query.startsWith('{"') || !query.endsWith('"}'))
            res.status(400).send({error: 'Query incorrecto.'})
    
            query = JSON.parse(query);
        }
    
        if(sort == 1 || sort == -1 || sort == "" || sort == undefined){
            sort
        } else {
            res.status(400).send({ error: 'Sort incorrecto.'})
        }
    
        const { docs: products, ...pageInfo } = await productManager.getProducts( page, limit, query, sort )
    
        // CREACION DE LOS BOTONES SIGUIENTES Y ANTERIOR
    
        if(query){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}` : ''
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}` : ''
        } else if (query && sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : ''
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : ''
        } else {
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}` : ''
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}` : ''
        }
    
        if(sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&sort=${sort}` : ''
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&sort=${sort}` : ''
        } else if (query && sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : ''
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : ''
        } else{
            
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}` : ''
        
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}` : ''
    
        }
        
        const cart = await cartManager.getCartById(req.user.cart._id)
    
        res.render('home', {
            title: 'Home',
            user: req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin'
            } : null,
            idCart: cart._id,
            products,
            pageInfo,
            style: 'home'
        })
    }

    // Ruta del realtimeproducts
    async getRealTimeProducts (req, res) {

        let { query, page, limit, sort } = req.query
    
        if(query){
            if (!query.startsWith('{"') || !query.endsWith('"}'))
            res.status(400).send({error: 'Query incorrecto.'})
    
            query = JSON.parse(query);
        }
    
        if(sort == 1 || sort == -1 || sort == "" || sort == undefined){
            sort
        } else {
            res.status(400).send({ error: 'Sort incorrecto.'})
        }
    
        const { docs: products, ...pageInfo } = await productManager.getProducts( page, limit, query, sort)
    
        // CREACION DE LOS BOTONES SIGUIENTES Y ANTERIOR
    
        if(query){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}` : ''
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}` : ''
        } else if (query && sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : ''
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : ''
        } else {
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.prevPage}&limit=${pageInfo.limit}` : ''
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.nextPage}&limit=${pageInfo.limit}` : ''
        }
    
        if(sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&sort=${sort}` : ''
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&sort=${sort}` : ''
        } else if (query && sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : ''
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : ''
        } else{
            
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.prevPage}&limit=${pageInfo.limit}` : ''
        
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/realtimeproducts?page=${pageInfo.nextPage}&limit=${pageInfo.limit}` : ''
    
        }
    
        const cart = await cartManager.getCartById(req.user.cart._id)
    
        res.render('realtimeproducts', {
            title: 'Products in Real Time',
            user: req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin'
            } : null,
            idCart: cart._id,
            products,
            pageInfo,
            style: 'realtimeproducts'
        })
    }

    // Ruta del carrito
    async getCartHome(req, res) {

        const { cid } = req.params
        
        let cart = await cartManager.getCartById({ _id: cid })
    
        cart = await cart.populate({ path: 'products.product', select: [ 'title', 'price', 'category' ] })
    
        const { products } = cart
    
        products.map(prod => {
            prod.product.price = prod.quantity * prod.product.price
        })
        
        const totalCarrito = products.reduce((ac, pr) => ac = ac+pr.product.price, 0)
    
        res.render('carts', {   
            title: 'Carrito De Compras',
            user:  req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin'
            } : null,
            products,
            totalCarrito,
            style: 'carts'
        })
    }

}

module.exports = new HomeController()
