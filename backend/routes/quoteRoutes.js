import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Built-in auto quotes (no DB required)
const builtInQuotes = [
  "You are stronger than you think.",
  "Every day is a fresh start.",
  "Your mind is powerful—feed it positivity.",
  "Small steps every day lead to big change.",
  "You’ve survived 100% of your worst days.",
  "It’s okay to not be okay—keep going.",
  "Your feelings are valid. You matter.",
  "Growth is quiet. Healing is slow. Progress is real.",
  "Breathe. Reset. Restart.",
  "Be kind to yourself today.",
  "You are doing better than you think.",
  "Your journey is unique—embrace it.",
  "Rest is productivity too.",
  "Storms don’t last forever.",
  "One moment at a time is enough.",
  "Believe that you can, and you will.",
  "Your mental health is your superpower.",
  "You are capable of amazing things.",
  "Courage is not the absence of fear but the triumph over it.",
  "You deserve peace. Choose it daily."
];

// Auto quote generator (daily unique)
function getQuoteForDay(userId) {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const hash = [...userId].reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Unique per-user + per-day
  const index = (dayOfYear + hash) % builtInQuotes.length;

  return {
    text: builtInQuotes[index],
    author: "MannMitra AI",
  };
}

// API: Return today's auto-generated quote
router.get("/today", protect, async (req, res) => {
  try {
    const quote = getQuoteForDay(req.user._id.toString());
    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;