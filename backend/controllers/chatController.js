import { GoogleGenerativeAI } from "@google/generative-ai";
import Assessment from "../models/Assessment.js";
import User from "../models/User.js";
import { checkAndAwardBadges } from "../services/badgeService.js";
import { detectAndHandleCrisis } from "../services/safetyService.js";

export const chatReply = async (req, res) => {
  const { message, chatHistory = [] } = req.body;

  if (!message) return res.status(400).json({ reply: "Please enter a message." });

  // Enhanced Crisis Detection
  const { isCrisis } = await detectAndHandleCrisis(message, req.user, "chat");
  
  if (isCrisis) {
    return res.json({ 
      reply: "It sounds like you are in intense emotional pain right now. Please know that you are not alone and help is available. **If you are in immediate danger, please call emergency services. Helplines: 988 (US/Canada), 112 (EU), 9152987821 (India - AASRA).** Please reach out to your assigned mentor or a trusted contact right now. We care about you.",
      crisisDetected: true 
    });
  }

  try {
    // Initialize Gemini lazily
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Fetch user's latest mood context
    const latestAssessment = await Assessment.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const moodContext = latestAssessment
      ? `The user's latest PHQ-9 score is ${latestAssessment.score} (${latestAssessment.severity} depression). Use this to be extra empathetic.`
      : "No assessment data available yet.";

    // Format conversation history
    const conversationContext = chatHistory.length > 0
      ? chatHistory.map(h => `${h.sender === 'user' ? 'User' : 'MannMitra'}: ${h.text}`).join('\n')
      : "No previous messages.";

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are MannMitra, a compassionate and supportive AI mental wellness companion. 
      Your goal is to provide emotional support, suggest coping mechanisms (like breathing or RBT), and listen without judgment.
      
      User Health Context: ${moodContext}
      
      Recent Conversation History:
      ${conversationContext}
      
      Rules:
      - Be warm, empathetic, and professional.
      - If the user mentions self-harm or deep crisis, gently suggest they use the "Crisis Support" button or contact a helpline.
      - Keep responses relatively concise but meaningful.
      - Use RBT (Rational Behavior Therapy) principles if they are struggling with negative thoughts.

      User says: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const reply = aiResponse.text();

    // Increment chat stats and check for badges
    let newBadges = [];
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.stats.chatCount = (user.stats.chatCount || 0) + 1;
        newBadges = await checkAndAwardBadges(user);
        await user.save();
      }
    }

    res.json({ reply, newBadges });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.json({ reply: "I'm having a little trouble connecting right now, but I'm here for you. How are you feeling overall? 🌸" });
  }
};