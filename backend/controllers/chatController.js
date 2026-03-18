import { GoogleGenerativeAI } from "@google/generative-ai";
import Assessment from "../models/Assessment.js";

export const chatReply = async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ reply: "Please enter a message." });

  try {
    // Initialize Gemini lazily
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetch user's latest mood context
    const latestAssessment = await Assessment.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const moodContext = latestAssessment
      ? `The user's latest PHQ-9 score is ${latestAssessment.score} (${latestAssessment.severity} depression). Use this to be extra empathetic.`
      : "No assessment data available yet.";

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are MannMitra, a compassionate and supportive AI mental wellness companion. 
      Your goal is to provide emotional support, suggest coping mechanisms (like breathing or RBT), and listen without judgment.
      
      User Context: ${moodContext}
      
      Rules:
      - Be warm, empathetic, and professional.
      - If the user mentions self-harm or deep crisis, gently suggest they use the "Crisis Support" button or contact a helpline.
      - Keep responses relatively concise but meaningful.
      - Use RBT (Rational Behavior Therapy) principles if they are struggling with negative thoughts.

      User says: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.json({ reply: "I'm having a little trouble connecting right now, but I'm here for you. How are you feeling overall? 🌸" });
  }
};