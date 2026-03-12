import mongoose from "mongoose";

const safePlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["police", "hospital", "pharmacy", "fire_station", "shelter"],
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
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
  },
  { timestamps: true },
);

export default mongoose.model("SafePlace", safePlaceSchema);
