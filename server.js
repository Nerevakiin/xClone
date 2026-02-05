import express from 'express'
import { tweetsRouter } from './routes/tweetsRouter.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import session from 'express-session'
import dotenv from 'dotenv'

dotenv.config() // setting up the dot env file to store the secret

const app = express()
const PORT = 8000
const secret = process.env.SPIRAL_SESSION_SECRET || 'kolotsibouxalaoua'

app.use(express.json())

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

app.listen(PORT, () => {
    console.log(`Server running and listening at port: ${PORT}`)
}).on('error', (err) => {
    console.log('Failed to start server: ', err)
})