// Importar los productos del JSON a MONGO

const fs = require('fs/promises')
const path = require('path')
const mongoose = require('mongoose')

const productModel = require('../dao/models/product.model')

async function seed() {
    await mongoose.connect("mongodb+srv://ulisesros70:Ulises12@cluster1.tvi8kiv.mongodb.net/ecommerce?retryWrites=true&w=majority")

    const filepath = path.join(__dirname, '../', 'dao/data/productos.json')
    const data = await fs.readFile(filepath, 'utf-8')
    const products = JSON.parse(data).map(({ id, ...product }) => product)

    const result = await productModel.insertMany(products)

    console.log(result)

    await mongoose.disconnect()
}

seed()