(async () => {
    const http = require('http')
    const path = require('path')

    const express = require('express')
    const handlebars = require('express-handlebars')
    const { Server } = require('socket.io')
    const mongoose = require('mongoose')
    require('dotenv').config()

    const { api, home } = require('./routes')
    const SocketManager = require('./websocket')

    try {
        
        // conectar la base de datos antes de levantar el server
        
        await mongoose.connect(process.env.MONGO_CONNECT) // Variable de entorno: mongodb+srv://ulisesros70:Ulises12@cluster1.tvi8kiv.mongodb.net/ecommerce?retryWrites=true&w=majority
        
        const app = express()
        const server = http.createServer(app) 
        const io = new Server(server) // SOCKET
        
        const { usuarioAut } = require('./middlewares')
        
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
        
        // middlware del socket
        app.use((req, res, next) => {
            req.io = io
        
            next()
        })
        
        app.use(usuarioAut)
        
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

