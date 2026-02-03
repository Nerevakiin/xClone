import express from 'express'
import { tweetsRouter } from './routes/tweetsRouter.js'

const app = express()
const PORT = 8000

app.use(express.json())


app.use(express.static('public'))

app.use('/api/tweets', tweetsRouter)

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