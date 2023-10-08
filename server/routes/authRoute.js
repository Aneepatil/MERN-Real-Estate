import express from 'express'
import { login, register } from '../controllers/authController.js'

const authRoute = express.Router()

authRoute.post('/sign-up',register)
authRoute.post('/sign-in',login)

export default authRoute