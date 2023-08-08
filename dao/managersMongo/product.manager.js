//PRODUCT MANAGER CON MONGO

// Importacion del modelo de mongo
const productModel = require('../models/product.model')

class ProductManager {

    async addProduct ( producto ) {
        
        const product = await productModel.create( producto )

        return product
        
    }

    async getProducts () {
        const products = await productModel.find().lean()

        return products
    }
    

    async getProductById ( id ) {
        const products = await productModel.find({ _id: id })

        return products[0]
    }
    
    async updateProduct (id, product) {
        
        const result = await productModel.updateOne({ _id: id }, product)

        return result
    }

    async deleteProduct (id) {
        
        const result = await productModel.deleteOne({ _id: id })

        return result
        
    }

}

module.exports = new ProductManager()


