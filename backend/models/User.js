import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "mentor", "student"], default: "student" },
    firstLogin: { type: Boolean, default: true },
    assessmentCompleted: { type: Boolean, default: false },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);