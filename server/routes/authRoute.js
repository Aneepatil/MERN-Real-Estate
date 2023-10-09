import express from 'express'
import { googleSignin, login, register } from '../controllers/authController.js'

const authRoute = express.Router()

authRoute.post('/sign-up',register)
authRoute.post('/sign-in',login)
authRoute.post('/google',googleSignin)

export default authRoute