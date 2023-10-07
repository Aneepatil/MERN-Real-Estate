import express from 'express'
import { register } from '../controllers/userController.js'

const userRoute = express.Router()

userRoute.post('/sign-up',register)

export default userRoute