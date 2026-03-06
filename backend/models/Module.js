import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: ["Anxiety", "Stress", "Depression", "Self-Esteem", "General"],
            default: "General"
        },
        sections: [
            {
                title: { type: String, required: true },
                content: { type: String, required: true }, // Markdown or HTML content
                contentType: { type: String, enum: ["text", "video", "exercise"], default: "text" },
                order: { type: Number, required: true },
            },
        ],
        gameType: { type: String, enum: ["ThoughtChallenger", "ABCDE", "None"], default: "None" },
    },
    { timestamps: true }
);

export default mongoose.model("Module", moduleSchema);
