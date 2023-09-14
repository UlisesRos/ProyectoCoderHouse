const { Router } = require('express')
const productController = require('../../controllers/apiControllers/products.controllers')

const router = Router()

router.get('/', productController.getProducts)

router.get('/:pid', productController.getProductById)

router.post('/', productController.addProduct)

router.put('/:pid', productController.updateProduct)

router.delete('/:pid', productController.deleteProduct)

module.exports = router