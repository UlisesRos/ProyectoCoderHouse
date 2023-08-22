const { Router } = require('express')
const userManager = require('./../dao/managersMongo/user.manager')
const cartManager = require('./../dao/managersMongo/cart.manager')
const autenticacion = require('../middlewares/autenticacion.middlewares.js')

const router = Router()

router.get('/profile', autenticacion, async (req, res) => {

    const cart = await cartManager.getCart()
    res.render('profile', {
        ...req.session.user,
        style: 'login',
        user: req.user ? {
            ...req.user,
            isAdmin: req.user.role == 'admin'
        } : null,
        idCart: cart[0]._id
    })
})

router.get('/signup', (req, res) => {

    res.render('signup',{
        style: 'signup'
    })

})

router.post('/signup', async (req, res) => {
    const user = req.body

    // Verificamos si el usuario existe a traves del email
    const userEmail = await userManager.getUserByEmail(user.email)

    if(userEmail){
        return res.render('signup', {
            error: 'El Email ingresado ya existe.',
            style: 'signup'
        })
    }

    // Creaccion del usuario
    try {

        const newUser = await userManager.addUser(user)
        
        req.session.user = {
            name: newUser.first_name,
            id: newUser._id,
            ...newUser._doc
        }

        req.session.save((err) => {
            res.redirect('/')
        })

    } catch (error) {
        return res.render('signup', {
            error: 'Ocurrio un error. Vuelve a intentarlo',
            style: 'signup'
        })
    }

})

router.get('/login', (req, res) => {

    res.render('login', {   
        style: 'login'
    })

})

router.post('/login', async (req, res) => {

    const { email } = req.body

    try {

        const user = await userManager.getUserByEmail(email)
        
        if(!user){
            return res.render('login', {
                error: 'El usuario no existe',
                style: 'login'
            })
        }

        if(user.email == "adminCoder@coder.com" && user.password == "adminCod3r123"){

            req.session.user = {
                name: user.first_name,
                id: user._id,
                ...user,
                role: 'admin'
            }

            req.session.save((err) => {
                if(!err){
                    res.redirect('/')
                }
            })

        } else {
            req.session.user = {
                name: user.first_name,
                id: user._id,
                ...user
            }

            req.session.save((err) => {
                if(!err){
                    res.redirect('/')
                }
            })
        }


    } catch (error) {
        console.log(error)
        res.render('login', {
            error: 'Ocurrio un error. Vuelve a intentarlo.',
            style: 'login'
        })
    }

})

router.get('/logout', autenticacion, (req, res) => {

    // const { user } = req.cookies

    // // Borrar las cookies
    // res.clearCookie('user')

    req.session.destroy((err) => {
        if(err) {
            return res.redirect('/error')
        }
    })

    res.render('logout', {
        user: req.user.name,
        style: 'login'
    })
})

module.exports = router