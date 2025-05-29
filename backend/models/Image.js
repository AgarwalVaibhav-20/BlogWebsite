import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
