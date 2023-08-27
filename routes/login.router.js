const { Router } = require('express')
const passport = require('passport')
const userManager = require('./../dao/managersMongo/user.manager')
const cartManager = require('./../dao/managersMongo/cart.manager')
const autenticacion = require('../middlewares/autenticacion.middlewares.js')
const {verificacionLogin, verificacionSignup} = require('../middlewares/verificaciones.midleware')
const { hashPassword, isValidPassword } = require('../utils/password')
const { GITHUB_STRATEGY_NAME } = require('../config/config.password')

const router = Router()

// Funciones controladoras

const signup = async (req, res) => {
    const user = req.body

    // Verificamos si el usuario existe a traves del email
    const userEmail = await userManager.getUserByEmail(user.email)

    if(userEmail){
        return res.render('signup', {
            error: 'El Email ingresado ya existe.',
            style: 'signup'
        })
    }

    if(user.password !== user.password2) {
        return res.render('signup', {
            error: 'Las contraseñas no coinciden.',
            style: 'signup'
        })
    }

    // Creaccion del usuario
    try {

        const newUser = await userManager.addUser({
            ...user,
            password: hashPassword(user.password)
        })
        
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

}

const login = async (req, res) => {

    const { email, password } = req.body

    try {

        const _user = await userManager.getUserByEmail(email)

        
        if(!_user){
            return res.render('login', {
                error: 'Contraseña o Usuario incorrecto',
                style: 'login'
            })
        }
        
        const { password: _password, ...user } = _user

        if(!password) {
            return res.render('login', {
                error: 'Contraseña requerida',
                style: 'login'
            })
        }

        if(!isValidPassword( password, _password )){
            return res.render('login', {
                error: 'Contraseña o Usuario incorrecto',
                style: 'login'
            })
        }



        if(_user.email == "adminCoder@coder.com" && password == "adminCod3r123"){

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

}

const logout = (req, res) => {

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
}

const resetpassword =  async (req, res) => {
    const { email, password1, password2 } = req.body

    const user = await userManager.getUserByEmail( email )

    if(!user){
        return res.render('resetpassword', {
            error: 'El usuario no existe',
            style: 'login'
        })
    }

    if(password1 !== password2) {
        return res.render('resetpassword', {
            error: 'Las contraseñas no coinciden.',
            style: 'login'
        })
    }

    try {
        
        await userManager.updateUser(user._id, {
            ...user,
            password: hashPassword(password1)
        })

        res.redirect('/login')

    } catch (error) {
        console.log(error)
        return res.render('resetpassword', {
            error: 'Ha ocurrido un error',
            style: 'login'
        })
    }

}

// Rutas de Login

router.get('/signup', (req, res) => {

    res.render('signup',{
        style: 'signup'
    })

})
router.get('/login', (req, res) => {

    res.render('login', {   
        style: 'login'
    })

})
router.get('/profile', autenticacion, async (req, res) => {

    const cart = await cartManager.getCart()
    res.render('profile', {
        ...req.user,
        style: 'login',
        user: req.user ? {
            ...req.user,
            isAdmin: req.user.role == 'admin'
        } : null,
        idCart: cart[0]._id
    })
})
router.get('/resetpassword', (req, res) => {
    res.render('resetpassword', {
        style: 'login'
    })
})
router.get('/logout', autenticacion, (req, res) => {
    const { first_name, last_name } = req.user

    req.logOut((err) => {
        if(!err){
            res.render('logout', {
                name: `${first_name} ${last_name}`,
                style: 'login'
            })
        }
    })
})

// RUTAS DE GITHUB

router.get('/github', passport.authenticate(GITHUB_STRATEGY_NAME), (req, res) => {})

router.get('/githubSessions', passport.authenticate(GITHUB_STRATEGY_NAME), (req, res) => {
    const user = req.user

    req.session.user = {
        id: user.id,
        name: user.first_name,
        role: user?.role ?? "Customer",
        email: user.email
    }


    res.redirect('/')

})

router.post('/signup', verificacionSignup, passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup'
}))
router.post('/login', verificacionLogin, passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
}))
router.post('/resetpassword', resetpassword)

module.exports = router