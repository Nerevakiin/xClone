import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { tweetsRouter } from './routes/tweetsRouter.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import session from 'express-session'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config() // setting up the dot env file to store the secret

const app = express()
const PORT = 8000
const secret = process.env.SPIRAL_SESSION_SECRET || 'kolotsibouxalaoua'

// create the HTTP server (REQUIRED for WebSockets + Express)
const server = createServer(app)



// ======= create the WebSocket server =======
const wss = new WebSocketServer({ server }) // <- pass the HTTP server here

// websocket connection handler. this handles the new connection. Runs for each new client that connects
wss.on('connection', (ws, request) => {
    
    console.log('NEW WEBSOCKET CONNECTION!')

    // extract session from cookies if needed (idk why?)
    const cookies = request.headers.cookie 
    // you can parse session from cookies here (idk what this means)

    // Handle messages from this client
    ws.on('message', (data) => {
        console.log('RECEIVED: ', data.toString())

        //echo back
        ws.send(`SERVER RECEIVED: ${data}`)

        //broadcast to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data)
            }
        })
    })

    // send welcome message
    ws.send(JSON.stringify({
        type: 'system',
        text: 'wra na gleipseis poutses gay adra!'
    }))
})




// ===== middleware section ======== 
app.use(express.json())

app.use(cors()) // CORS allow us to deploy our backend so others can also interact with it

// express-session set for authentication credentials and cookies to keep the session
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}))


app.use(express.static('public'))

app.use('/api/tweets', tweetsRouter)
app.use('/api/auth/me', meRouter)
app.use('/api/auth', authRouter)

app.use((req, res) => {
    res.status(400).json({
        error: 'invalid URL'
    })
})

server.listen(PORT, () => {
    console.log(`Server running and listening at port: ${PORT}`)
}).on('error', (err) => {
    console.log('Failed to start server: ', err)
})