import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mood: {
      type: String,
      enum: ["Happy", "Calm", "Neutral", "Sad", "Stressed"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);
