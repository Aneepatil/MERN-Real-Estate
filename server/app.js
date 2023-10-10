import express from 'express'
import cors from 'cors'
import { dbConnect } from './dbConnect/dbConnect.js'
import authRoute from './routes/authRoute.js'
import { globleErrorHandler } from './middlewares/globleErrorHandler.js'
import cookieParser from 'cookie-parser'
import userRoute from './routes/userRoute.js'
const app = express()


// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Configs
dbConnect(app)

// Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)

// Error Handler Middleware
app.use(globleErrorHandler)