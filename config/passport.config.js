// Generamos nuestras estrategias de passport

const passport = require('passport')
const local = require('passport-local')

const userManager = require('../dao/managersMongo/user.manager')
const { hashPassword, isValidPassword } = require('../utils/password')

const LocalStrategy = local.Strategy

const signup = async ( req, eemail, password, done ) => {
    const { password: _password, password2: _password2, ...user } = req.body

    const _user = await userManager.getUserByEmail( eemail )

    if(_user){
        console.log('El usuario ya existe.')
        return done(null, false)
    }

    try {
        
        const newUser = await userManager.addUser({
            ...user,
            password: hashPassword(password)
        })

        return done(null, {
            name: newUser.first_name,
            id: newUser._id,
            ...newUser._doc
        })

    } catch (error) {
        console.log('Ha ocurrido un error')
        done(error, false)
    }

}

const login = async ( email, password, done ) => {

    try {
        
        const _user = await userManager.getUserByEmail( email )

        if(!_user){
            console.log('Contraseña o Usuario incorrecto')
            return done(null, false)
        }

        if (!password) {
            return done(null, false)
        }

        if(!isValidPassword( password, _user.password )){
            console.log('Contraseña o Usuario incorrecto')
            return done(null, false)
        }
        
        done(null, _user)

    } catch (error) {
        console.log('Ha ocurrido un error')
        done(error, false)
    }

}


module.exports = {
    LocalStrategy,
    signup,
    login
}