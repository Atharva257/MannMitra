import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [{ type: Number, required: true }], // 0-3 for each PHQ-9 question
  score: { type: Number, required: true },
  severity: { type: String, required: true },
}, { timestamps: true });

// Index for fast dashboard history retrieval
assessmentSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Assessment", assessmentSchema);