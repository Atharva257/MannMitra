import express from "express";
import Mood from "../models/Mood.js";
import protect from "../middleware/authMiddleware.js";
import { handleCrisisMatch, checkMoodTrend } from "../services/safetyService.js";

const router = express.Router();

// Add mood (restricted to once per day)
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
      return res.status(400).json({ message: "Mood already selected for today. It cannot be changed." });
    }

    const newMood = await Mood.create({ user: userId, mood });

    // Immediate Trend Check
    const { isNegativeTrend, moods } = await checkMoodTrend(userId);
    if (isNegativeTrend) {
      await handleCrisisMatch(
        req.user, 
        `Automatic Alert: Consistent negative mood trend detected (${moods.join(' -> ')})`, 
        "mood", 
        "medium"
      );
    }

    res.status(201).json(newMood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get last 7 days moods for chart (everyday tracking)
router.get("/history", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const results = [];

    // Generate last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const moodEntry = await Mood.findOne({
        user: userId,
        createdAt: { $gte: date, $lt: nextDay },
      });

      results.push({
        createdAt: date.toISOString(),
        mood: moodEntry ? moodEntry.mood : null,
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;