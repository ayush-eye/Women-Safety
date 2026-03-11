import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true
    },
    email: {    
        type: String,
        required: true,
        unique: true    
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default:"USER"
    },
    contact: 
    {
        type: String,
        required: true,
        trim: true
    },
    emergency_contacts:
    [
        {
            name:
            {
                type: String,
                required: true
            },
            contact:
            {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    profilePhoto:
    {
        type: String,
        default: "/uploads/default-profile.png"
    }
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;