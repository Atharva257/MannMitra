import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: String, default: "MannMitra" },
    category: {
      type: String,
      enum: ["Happy", "Calm", "Neutral", "Sad", "Stressed", "General"],
      default: "General",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);
