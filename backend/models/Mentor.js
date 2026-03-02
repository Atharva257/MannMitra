import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  approved: { type: Boolean, default: false }
});

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;
