import express from 'express'
import { register } from '../controllers/userController.js'

const authRoute = express.Router()

authRoute.post('/sign-up',register)

export default authRoute