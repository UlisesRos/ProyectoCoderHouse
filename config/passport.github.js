const GithubStrategy = require('passport-github2')
const userManager = require('../dao/managersMongo/user.manager')
const cartManager = require('../dao/managersMongo/cart.manager')
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, PORT, HOST, GITHUB_STRATEGY_NAME } = require('./config')

const GitHubAccessConfig = { clientID: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET, callBackURL: `http://${HOST}:${PORT}/githubSessions` }


// LOGICA DEL USUARIO

const gitHubUser = async (profile, done) => {

    console.log(profile._json)
    const { name, email } = profile._json
    const _user = await userManager.getUserByEmail( email )
    if(!_user){
        console.log('Usuario inexistente')
        
        const cart = await cartManager.addCart()

        const newUser = {
            first_name: name.split(" ")[0],
            last_name: name.split(" ")[1],
            email: email,
            password: "",
            cart: cart
        }

        const result = await userManager.addUser(newUser)

        return done(null, result)
    }

    // SI EL USUARIO YA EXISTE
    console.log('El usuario ya existe, rol asignado: ', _user?.role)
    return done(null, _user)

}
const profileController = async ( accessToken, refreshToken, profile, done ) => {
    try {

        return await gitHubUser(profile, done)

    } catch (error) {
        console.log(error)
        done(error)
    }
}

module.exports = {
    GithubStrategy,
    GitHubAccessConfig,
    profileController,
    strategyName: GITHUB_STRATEGY_NAME
}