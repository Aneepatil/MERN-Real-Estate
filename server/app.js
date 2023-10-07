import express from 'express'
import { dbConnect } from './dbConnect/dbConnect.js'
const app = express()


// Middlewares
app.use(express.json())

// Configs
dbConnect(app)