import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import entryRouter from './routes/details.route.js'
import connectDB from './config/dbConnection.js'
import path from 'path'
import cors from 'cors'


const __dirname = path.resolve()

dotenv.config()
const app = express()

app.use(cors())

connectDB()

app.use(express.json())


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/entries', entryRouter)

//-------------deployment--------------//
app.use(express.static(path.join(__dirname, 'frontEnd/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontEnd/dist/index.html'))
})
//------------deployment--------------//

// Catch-all route for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" })
})

// Error-handling middleware
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || "Internal server error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

const port = process.env.PORT || 5000
app.listen(port, (err) => {
    if (err) {
        console.error("Failed to start server:", err)
    } else {
        console.log(`Server is running on port ${port}`)
    }
})
