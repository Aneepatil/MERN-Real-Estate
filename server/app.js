import express from 'express'
import { dbConnect } from './dbConnect/dbConnect.js'
import authRoute from './routes/authRoute.js'
// import userRoute from './routes/userRoute.js'
const app = express()


// Middlewares
app.use(express.json())

// Configs
dbConnect(app)

// Routes
app.use('/api/v1/auth', authRoute)
// app.use('api/v1/user', userRoute)