const { Router } = require('express')
const productController = require('../../controllers/apiControllers/products.controllers')
const { policiesAdmin } = require('../../middlewares/policies.middleware')

const router = Router()

router.get('/', productController.getProducts)

router.get('/:pid', productController.getProductById)

router.post('/', policiesAdmin, productController.addProduct)

router.put('/:pid', policiesAdmin, productController.updateProduct)

router.delete('/:pid', policiesAdmin, productController.deleteProduct)

module.exports = router