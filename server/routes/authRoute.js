import express from 'express'
import { googleSignin, login, register } from '../controllers/authController.js'
import { signOutUser } from '../controllers/userController.js'

const authRoute = express.Router()

authRoute.post('/sign-up',register)
authRoute.post('/sign-in',login)
authRoute.post('/google',googleSignin)
authRoute.get('/sign-out',signOutUser)

export default authRoute