
module.exports = {
    //Conexion a la Base de Datos
    MONGO_CONNECT: process.env.MONGO_CONNECT,

    // PUERTO Y HOST
    PORT: process.env.PORT,
    HOST: process.env.HOST,

    // Conexion con GitHub
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_STRATEGY_NAME: process.env.GITHUB_STRATEGY_NAME,

    // ADMIN
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
}