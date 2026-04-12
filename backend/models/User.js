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
    currentStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
    badges: [{
      name: { type: String, required: true },
      category: { type: String, required: true },
      awardedAt: { type: Date, default: Date.now },
      icon: { type: String }
    }],
    stats: {
      breathingCount: { type: Number, default: 0 },
      journalCount: { type: Number, default: 0 },
      canvasCount: { type: Number, default: 0 },
      assessmentCount: { type: Number, default: 0 },
      cbtCount: { type: Number, default: 0 },
      chatCount: { type: Number, default: 0 },
      sessionCount: { type: Number, default: 0 },
    },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
    isAtRisk: { type: Boolean, default: false },
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