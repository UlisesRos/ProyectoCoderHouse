const { Router } = require("express")
const autenticacion = require('../middlewares/autenticacion.middlewares')
const homeControllers = require("../controllers/home.controllers")

const router = Router()

// rutas de home de HTML

router.get('/', autenticacion, homeControllers.getHome)
router.post('/', homeControllers.postHome)

router.get('/realtimeproducts', autenticacion, homeControllers.getRealTimeProducts)

router.get('/:cid/purchase', homeControllers.getOrderHome)

router.get('/carts/:cid', homeControllers.getCartHome)

module.exports = router