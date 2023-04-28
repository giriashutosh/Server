import express from "express"
import { createPost,deletePost,getPost, getTimelinePosts, likesPost, updatePost } from "../Controller/PostController.js";

const router = express.Router()

router.post('/', createPost)
router.get('/:id', getPost)
router.post('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likesPost)
router.get('/:id/timeline', getTimelinePosts)

export default router;