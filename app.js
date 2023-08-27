(async () => {
    const http = require('http')
    const path = require('path')

    const express = require('express')
    const handlebars = require('express-handlebars')
    const { Server } = require('socket.io')
    const mongoose = require('mongoose')
    const cookieParser = require('cookie-parser')
    const session = require('express-session')
    const MongoStore = require('connect-mongo')
    const passport = require('passport')
    require('dotenv').config()

    const { api, home } = require('./routes/index.js')
    const SocketManager = require('./websocket')
    const initPassportLocal = require('./config/passport.init.js')
    const { isValidPassword } = require('./utils/password.js')

    try {
        
        // conectar la base de datos antes de levantar el server
        
        await mongoose.connect(process.env.MONGO_CONNECT) // Variable de entorno: mongodb+srv://ulisesros70:Ulises12@cluster1.tvi8kiv.mongodb.net/ecommerce?retryWrites=true&w=majority
        
        const app = express()
        const server = http.createServer(app) 
        const io = new Server(server) // SOCKET
        
        //handlebars
        app.engine('handlebars', handlebars.engine({
            extname: 'handlebars',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true
            }
        }));
        app.set('views', path.join(__dirname, '/views'))
        app.set('view engine', 'handlebars')
        
        app.use(express.urlencoded({ extended: true })) // Para poder parsear el body y los query params
        app.use(express.json())
        app.use('/static', express.static(path.join(__dirname + '/public')))
        app.use(cookieParser('secret'))

        app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true,
            store: MongoStore.create({
                mongoUrl: process.env.MONGO_CONNECT,
                ttl: 60 * 30
            })
        }))

        //Registramos los middlewares de passport
        initPassportLocal()
        app.use(passport.initialize())
        app.use(passport.session())
        
        //middlware GLOBAL
        app.use((req, res, next) => {

            if(req.user){  

                if(req.user.email == "adminCoder@coder.com" && isValidPassword('adminCod3r123', req.user.password)){
                    req.user.role = 'admin'
                }

            }
        

            next()
        })

        // middlware del socket
        app.use((req, res, next) => {
            req.io = io
        
            next()
        })
        
        // ruta del home
        app.use('/', home)
        
        // ruta de las api
        app.use('/api', api)
        
        // WEB SOCKET
        
        io.on('connection', SocketManager)
        
        
        const port = process.env.PORT // Variable de entorno: 8080
        
        server.listen(port, () => {
            console.log(`Servidor leyendose desde http://localhost:${port}`)
        })

        console.log('Se ha conectado a la base de datos de MongoDb')

    } catch (error) {
        console.log('No se ha podido conectar a la base de datos')
        console.log(error)
    }
})()

