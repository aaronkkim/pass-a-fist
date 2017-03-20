import env from './env'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { defaultErrorHandler, corsOptions } from './handlers'
import api from '../models'
import session from '../authentication/sessions'
import Auth from '../authentication/auth'


// ENABLE ROUTES IF USING app SIDE ROUTING
// import routes from './routes'

let app = express()
let server = require('http').createServer(app)

function Validate(req, res, next) {
    // ONLY ALLOW GET METHOD IF NOT LOGGED IN 
    if (req.method !== 'GET' && !req.session.uid) {
        return res.send({ error: 'Please Login or Register to continue' })
    }
    return next()
}

function logger(req, res, next) {
    console.log('INCOMING REQUEST', req.url)
    next()
}

// REGISTER MIDDLEWARE
app.use(session)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('*', logger)
app.use('*', cors(corsOptions))
app.use(Auth)

// LOCKS API TO REQUIRE USER AUTH
app.use(Validate)
app.use('/api', api)
app.use('/', defaultErrorHandler)

let io = require('socket.io')(server, {
    origins: '*:*'
})

io.sockets.on('connection', function (socket) {
    socket.emit('CONNECTED', "Hello Mr. Socket! How are you today?")

    socket.on('update', function (data) {
        console.log(data)
    })

    socket.on('joining', function (data) {
        console.log("data: ", data)
        socket.join(data.name, function () {
            console.log("attempting to connect user")
            socket.to(data.name).emit("joined", data)
            // io.in(data.name)

            console.log("you have joined " + data.name + " chat!")

        })
    })
    socket.on('message', (d) => {
        console.log("sending message to:", d.name, "in", d.gameName)
        io.to(d.gameName).emit('message', d)
    })
    socket.on('leavegame', function (room) {

        // console.log(socket)
        // console.log(socket.rooms, socket.room)
        // console.log("player leaving", room)
        socket.leave(room, () => {
            socket.to(room).emit("leavegame", room) 
       // console.log("player has left")
        })

    })
})

export default server