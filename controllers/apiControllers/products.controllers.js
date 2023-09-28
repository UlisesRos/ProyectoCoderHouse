const ManagerFactory = require('../../dao/managersMongo/manager.factory')

const productManager = ManagerFactory.getManagerInstance('products')

class ProductController {

    async getProducts (req, res) {

        console.log(req.user, "controlador")
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
    
        if(query){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}` : null
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}` : null
        } else if (query && sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : null
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : null
        } else {
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}` : null
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}` : null
        }
    
        if(sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&sort=${sort}` : null
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&sort=${sort}` : null
        } else if (query && sort){
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : null
    
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}&query=${query}&sort=${sort}` : null
        } else{
            
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${pageInfo.limit}` : null
        
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${pageInfo.limit}` : null
    
        }
            
        try {
            res.send({
                status: 'success',
                payload: products,
                totalPages: pageInfo.totalPages,
                prevPage: pageInfo.prevPage,
                nextPage: pageInfo.nextPage,
                page: pageInfo.page,
                hasPrevPage: pageInfo.hasPrevPage,
                hasNextPage: pageInfo.hasNextPage,
                prevLink: pageInfo.prevLink,
                nextLink: pageInfo.nextLink
            })
        } catch{
            res.send({
                status: 'error',
                payload: products,
                totalPages: pageInfo.totalPages,
                prevPage: pageInfo.prevPage,
                nextPage: pageInfo.nextPage,
                page: pageInfo.page,
                hasPrevPage: pageInfo.hasPrevPage,
                hasNextPage: pageInfo.hasNextPage,
                prevLink: pageInfo.prevLink,
                nextLink: pageInfo.nextLink
            })
        }
    
    }

    async getProductById (req, res) {
        const { pid } = req.params
    
        try {
    
            const product = await productManager.getProductById(pid)
            
            if(!product){
                res.status(404).send({
                    Error: 'ID INEXISTENTE'
                })
            }
            res.send(product)
            
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el servidor'})
        }
    
    }

    async addProduct (req, res) {
        const { body } = req
    
        const {docs: product} = await productManager.getProducts()
        
        if(!body.title || !body.description || !body.price || !body.category || !body.code || !body.stock){
            res.status(400).send({
                Error: 'todos los campos son obligatorios'
            })
        } else if (product.find(prod => prod.title == body.title || prod.code == body.code)) {
            res.status(400).send({
                Error: 'title o code ya existe'
            })
        } else {
            req.io.emit('addProduct', body);
            await productManager.addProduct(body)
            res.status(201).send({Created: `El Producto ${body.title} fue creado con exito`})
        }
        
    }

    async updateProduct (req, res) {
        const { pid } = req.params
        const { body } = req
    
        try {
            
            const result = await productManager.updateProduct(pid, body)
            if(result.matchedCount >= 1){
                res.status(202).send({Accepted: `El producto con id: ${pid} ha sido modificado.`})
                return
            }
            
            res.status(404).send({
                Error: 'ID INEXISTENTE'
            })
    
        } catch (error) {
    
            res.status(500).send({
                message: 'Ha ocurrido un error en el servidor',
                exception: error.stack
            })
        }
    
    }

    async deleteProduct (req, res) {
        const { pid } = req.params
        
        try {
            
            const productId = await productManager.getProductById( pid )
    
            req.io.emit('deleteProduct', productId.code)
    
            const result = await productManager.deleteProduct(pid)
            if (result.deletedCount >= 1) {
                res.status(200).send({OK: `El producto con id: ${pid} ha sido eliminado.`})
                return
            }
            
            res.status(404).send({
                Error: 'ID INEXISTENTE'
            })
            
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el servidor'})
        }
        
    }
}

module.exports = new ProductController()