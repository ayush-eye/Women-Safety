import mongoose from "mongoose";

const dangerPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    description: String,
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true },
);

export default mongoose.model("DangerPlace", dangerPlaceSchema);
