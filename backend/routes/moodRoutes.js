import express from "express";
import Mood from "../models/Mood.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add or update today's mood
router.post("/", protect, async (req, res) => {
  try {
    const { mood } = req.body;
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already logged mood for today
    const existingMood = await Mood.findOne({
      user: userId,
      createdAt: { $gte: today },
    });

    if (existingMood) {
      existingMood.mood = mood;
      await existingMood.save();
      return res.json(existingMood);
    }

    const newMood = await Mood.create({ user: userId, mood });
    res.status(201).json(newMood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get last 7 days moods for chart
router.get("/history", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moods = await Mood.find({
      user: userId,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: 1 });

    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;