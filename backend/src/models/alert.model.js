import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    location: {
        lat: Number,
        lng: Number
    },

    message: {
        type: String,
        default: "SOS Emergency"
    },

    status: {
        type: String,
        enum: ["active", "resolved"],
        default: "active"
    }
},
{ timestamps: true }
);

export default mongoose.model("Alert", alertSchema);