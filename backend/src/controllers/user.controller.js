import User from "../models/user.model.js";


export const getprofile = async (req,res)=>{

    try{

        const userId = req.user.id;
        const user = await User.findById(userId).select("-password -createdAt -updatedAt -__v");

        return res.status(200).json({ user });
    }
    catch(e)
    {
        return res.status(500).json({"message":"Something went Wrong"});
    }
}

export const uploadProfile = async (req, res) =>
{
    const userId = req.user.id;

    const photoPath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
        userId,
        { profilePhoto: photoPath }
    ).select("-password");

    res.status(200).json({
        message: "Profile photo uploaded",
        user
    });
};

export const updateContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const { emergency_contacts } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { emergency_contacts },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Emergency contacts updated successfully",
            user
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to update contacts" });
    }
};