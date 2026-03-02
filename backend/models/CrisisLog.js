import mongoose from "mongoose";

const crisisLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trigger: { type: String, required: true }, // e.g. "Q9 > 0" or "Score >= 15"
}, { timestamps: true });

export default mongoose.model("CrisisLog", crisisLogSchema);
