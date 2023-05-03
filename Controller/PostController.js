import PostModel from "../Modals/postModel.js";
import UserModel from "../Modals/userModel.js";
import mongoose from "mongoose";

//Create Post
export const createPost = async (req, res) => {
   const newPost = new PostModel(req.body);
   console.log(newPost)
    try {
        await newPost.save();
        
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json(error)
    }
}

//Get Post
export const getPost = async (req,res) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
   }
  
}

//Update Post
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;
    try {
        const post = await PostModel.findById(postId)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json('Post Updated')
        } else {
            res.status(403).json("Action Forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//Delete a Post
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(postId);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json("Post deleted successfully");
        } else {
            res.status(403).json("Action Forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//like/dislike a post
export const likesPost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(postId)
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
            res.status(200).json("Post liked")
        } else {
            await post.updateOne({ $pull: { likes: userId } })
            res.status(200).json("Post Unliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
 

//GET Timeline Posts
// Get Timeline POsts
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const currentUserPosts = await PostModel.find({ userId: userId });
      const followingPosts = await UserModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "following",
            foreignField: "userId",
            as: "followingPosts",
          },
        },
        {
          $project: {
            followingPosts: 1,
            _id: 0,
          },
        },
      ]);
  
      res
        .status(200)
        .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a,b)=>{
            return b.createdAt - a.createdAt;
        })
        );
    } catch (error) {
      res.status(500).json(error);
    }
  };