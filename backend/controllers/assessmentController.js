import Assessment from "../models/Assessment.js";
import User from "../models/User.js";
import CrisisLog from "../models/CrisisLog.js";
import { allotMentorToStudent } from "../services/allotmentService.js";
import { checkAndAwardBadges } from "../services/badgeService.js";
import { detectAndHandleCrisis, handleCrisisMatch } from "../services/safetyService.js";

// Helper to calculate score + severity
const calculateScore = (answers) => {
  const score = answers.reduce((a, b) => a + b, 0);
  let severity = "Minimal";
  if (score >= 5 && score <= 9) severity = "Mild";
  else if (score >= 10 && score <= 14) severity = "Moderate";
  else if (score >= 15 && score <= 19) severity = "Moderately Severe";
  else if (score >= 20) severity = "Severe";
  return { score, severity };
};

// Save assessment
export const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || answers.length !== 9) {
      return res.status(400).json({ message: "PHQ-9 requires 9 answers" });
    }

    const { score, severity } = calculateScore(answers);

    // Automatic Crisis Trigger
    if (score >= 15 || answers[8] > 0) {
      await handleCrisisMatch(
        req.user, 
        `High Assessment Score: ${score} (${severity}). Q9: ${answers[8]}`, 
        "assessment", 
        score >= 20 ? "high" : "medium"
      );
    }

    const assessment = await Assessment.create({
      user: req.user._id,
      answers,
      score,
      severity,
    });

    // Update User Status & Allot Mentor
    const user = await User.findById(req.user._id);
    user.assessmentCompleted = true;
    user.stats.assessmentCount = (user.stats.assessmentCount || 0) + 1;
    
    // Check for new badges
    const newBadges = await checkAndAwardBadges(user);
    await user.save();

    await allotMentorToStudent(req.user._id);

    res.json({ score, severity, assessment, newBadges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get history
export const getHistory = async (req, res) => {
  try {
    const history = await Assessment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};