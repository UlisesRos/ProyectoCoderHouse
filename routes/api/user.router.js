const { Router } = require('express')
const userController = require('../../controllers/apiControllers/user.controllers')

const router = Router()

router.get('/', userController.getUsers)

router.get('/:id', userController.getUserById)

router.post('/', userController.addUser)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)

module.exports = router