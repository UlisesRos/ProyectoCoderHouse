const ManagerFactory = require('../dao/managersMongo/manager.factory')

const userManager = ManagerFactory.getManagerInstance('users')
const cartManager = ManagerFactory.getManagerInstance('carts')

class LoginController {

    // Mostrar Signup
    getSignup (req, res) {

        res.render('signup',{
            style: 'signup'
        })
    
    }

    // Mostrar Login
    getLogin (req, res) {

        res.render('login', {   
            style: 'login'
        })
    
    }

    // Mostrar Profile
    async getProfile (req, res) {

        const cart = await cartManager.getCartById(req.user.cart._id)
        res.render('profile', {
            ...req.user,
            style: 'login',
            user: req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin',
                isPublic: req.user.role == 'Customer'
            } : null,
            idCart: cart._id
        })
    }

    // Mostrar Logout
    getLogout (req, res) {
        const { first_name, last_name } = req.user
    
        req.logOut((err) => {
            if(!err){
                res.render('logout', {
                    name: `${first_name} ${last_name}`,
                    style: 'login'
                })
            }
        })
    }

    // Mostrar resetPassword
    getResetpassword (req, res) {
        res.render('resetpassword', {
            style: 'login'
        })
    }

    // Reiniciar Password
    async postResetpassword (req, res) {
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

    // Mostrar GithubSession
    getGithubSession (req, res) {
        const user = req.user
    
        req.session.user = {
            id: user.id,
            name: user.first_name,
            role: user?.role ?? "Customer",
            email: user.email
        }
    
    
        res.redirect('/')
    }
}

module.exports = new LoginController()