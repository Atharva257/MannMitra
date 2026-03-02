import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Role management
    role: {
      type: String,
      enum: ["student", "admin", "mentor"],
      default: "student",
    },

    // Track first login & assessment
    firstLogin: { type: Boolean, default: true },
    assessmentCompleted: { type: Boolean, default: false },

    // ✅ Assigned mentor (optional)
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },

    //Quotes
    lastQuote: { type: mongoose.Schema.Types.ObjectId, ref: "Quote"},
    lastQuoteDate: { type: String },

    // ✅ Trusted contacts for safety
    trustedContacts: [
      {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
