const express = require('express')
const http = require('http')
const { api, home } = require('./routes')
const path = require('path')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app) 
const io = new Server(server) // SOCKET

const SocketManager = require('./websocket')
const { usuarioAut } = require('./middlewares')

//handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
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


const port = 8080

server.listen(port, () => {
    console.log(`Servidor leyendose desde http://localhost:${port}`)
})