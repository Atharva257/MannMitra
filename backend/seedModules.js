import mongoose from "mongoose";
import dotenv from "dotenv";
import Module from "./models/Module.js";

dotenv.config();

const modules = [
    {
        title: "Overcoming Anxiety",
        description: "Learn to identify triggers and use RBT techniques to calm your mind.",
        category: "Anxiety",
        sections: [
            {
                title: "What is Anxiety?",
                content: "Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. The first day of school, going to a job interview, or giving a speech may cause most people to feel fearful and nervous.",
                order: 1,
            },
            {
                title: "The RBT Approach",
                content: "Rational Behavior Therapy teaches us that it's not the events that upset us, but our meanings for them. By changing our irrational beliefs, we change our emotional responses.",
                order: 2,
            }
        ],
        gameType: "ThoughtChallenger"
    },
    {
        title: "The ABCDE of Stress",
        description: "A deep dive into the ABCDE model for managing daily stressors.",
        category: "Stress",
        sections: [
            {
                title: "Intro to ABCDE",
                content: "The ABCDE model is a mnemonic for Activating event, Beliefs, Consequences, Disputation, and Effective new belief. It's a structured way to re-evaluate stress.",
                order: 1,
            }
        ],
        gameType: "ABCDE"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        await Module.deleteMany({});
        await Module.insertMany(modules);

        console.log("Modules seeded successfully! 🌱");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
