import express from "express"
import { registerUser } from "../Controller/AuthController.js"
const router = express.Router()

router.post('/register', registerUser)

export default router