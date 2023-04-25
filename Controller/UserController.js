import UserModel from "../Modals/userModel.js";



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
    const { currentUserId, currentUserAdmin}
    try {
        if(id)
    } catch (error) {
        
    }
}