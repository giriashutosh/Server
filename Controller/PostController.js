import PostModel from "../Modals/postModel.js";

//Create Post
export const createPost = async (req, res) => {
   const newPost = new PostModel(req.body);
   
    try {
        await newPost.save();
        res.status(200).json("Post created!");
    } catch (error) {
        res.status(500).json(error)
    }
}

//Get Post
export const getPost = async (req,res) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findById(id)
    } catch (error) {
        res.status(500).json(error)
   }
  
}