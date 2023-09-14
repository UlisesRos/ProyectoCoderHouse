const { Router } = require('express')
const adminController = require('../controllers/admin.controllers')

const router = Router()

router.get('/admin', adminController.getAdmin)

router.post('/admin', adminController.addProductAdmin)

module.exports = router