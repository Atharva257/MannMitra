import Assessment from "../models/Assessment.js";
import CrisisLog from "../models/CrisisLog.js";

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

    if (score >= 15 || answers[8] > 0) {
      await CrisisLog.create({
        user: req.user._id,
        trigger: answers[8] > 0 ? "Q9 > 0" : "Score >= 15",
      });
    }

    const assessment = await Assessment.create({
      user: req.user._id,
      answers,
      score,
      severity,
    });

    res.json({ score, severity, assessment });
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