import mongoose from "mongoose";

const crisisLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trigger: { type: String, required: true }, // e.g. "Crisis detected in chat"
  severity: { type: String, enum: ["high", "medium", "low", "none"], default: "none" },
  content: { type: String }, // Snippet of the content that triggered the log
  source: { type: String, enum: ["chat", "forum", "journal", "assessment", "system", "mood"] },
}, { timestamps: true });

export default mongoose.model("CrisisLog", crisisLogSchema);