import UserModel from "../Modals/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
//get a user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id)

        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("No such user exist");
        }
    } catch (error) {
        res.status(404).json(error)
    }
}


//Update user
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { _id,  password} = req.body;
    //console.log(req.body)
    if (id === _id ) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {
                new: true,
            })
            const token = jwt.sign({username: user.username, id: user._id},
                process.env.JWT_KEY,
                {expiresIn: '1h'})
            console.log({user, token})
            res.status(200).json({user, token});
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access Denied! you can update only your profile")
    }
}

//Delete
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully");
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! you can delete only your profile")
    }
}

//followUser

export const followUser = async (req, res) => {
    const id = req.params.id; //whom to follow
    const { currentUserId } = req.body; //who wants to follow

    if (currentUserId == id) {
        res.status(403).json("Action Forbidden")
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId)

            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $push: { followers: currentUserId } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json("Users Followed")
            } else {
                res.status(403).json("User is already followed by you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

//unfollowUser
export const unfollowUser = async (req, res) => {
    const id = req.params.id; //whom to follow
    const { currentUserId } = req.body; //who wants to follow

    if (currentUserId == id) {
        res.status(403).json("Action Forbidden")
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId)

            if (followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $pull: { followers: currentUserId } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(200).json("Users unFollowed")
            } else {
                res.status(403).json("User is not followed by you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
