import express from "express"
import { updateUser, getUser } from "../Controller/UserController.js"
const router = express.Router()

router.get('/:id', getUser)
router.put('/:id',updateUser)

export default router