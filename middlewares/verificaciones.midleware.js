const userManager = require('../dao/managersMongo/user.manager')
const { hashPassword, isValidPassword } = require('../utils/password')


async function verificacionLogin(req, res, next){

    const { email, password } = req.body

    try {

        const _user = await userManager.getUserByEmail(email)

        
        if(!_user){
            return res.render('login', {
                error: 'Contraseña o Usuario incorrecto',
                style: 'login'
            })
        }
        
        const { password: _password } = _user

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

    } catch (error) {
        console.log(error)
        res.render('login', {
            error: 'Ocurrio un error. Vuelve a intentarlo.',
            style: 'login'
        })
    }

    next()
}

async function verificacionSignup (req,res,next) {

    const user = req.body

    try {

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

    } catch (error) {
        return res.render('signup', {
            error: 'Ocurrio un error. Vuelve a intentarlo',
            style: 'signup'
        })
    }

    next()
}


module.exports = {
    verificacionLogin,
    verificacionSignup
}