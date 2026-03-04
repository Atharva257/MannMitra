import mongoose from "mongoose";

const moduleProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
        completedSections: [Number], // Array of section orders completed
        isCompleted: { type: Boolean, default: false },
        lastAccessed: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Ensure a user has only one progress record per module
moduleProgressSchema.index({ user: 1, module: 1 }, { unique: true });

export default mongoose.model("ModuleProgress", moduleProgressSchema);
