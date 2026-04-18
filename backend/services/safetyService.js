import { GoogleGenerativeAI } from "@google/generative-ai";
import CrisisLog from "../models/CrisisLog.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Mood from "../models/Mood.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Robust Crisis Detection Service
 */

// Comprehensive keyword patterns
const CRISIS_PATTERNS = [
  /suicide/i,
  /kill myself/i,
  /end my life/i,
  /want to die/i,
  /hopeless/i,
  /slash my/i,
  /cutting myself/i,
  /hurt myself/i,
  /worthless/i,
  /no reason to live/i,
  /goodbye world/i,
  /end it all/i,
  /overdose/i,
  /taking my life/i,
  /don't want to exist/i
];

/**
 * Checks if a message contains crisis keywords
 * @param {string} content - The text to check
 * @returns {boolean}
 */
export const containsCrisisKeywords = (content) => {
  return CRISIS_PATTERNS.some(regex => regex.test(content));
};

/**
 * Uses Gemini AI to perform a contextual safety check
 * @param {string} content - The text to check
 * @returns {Promise<{isCrisis: boolean, severity: string, explanation: string}>}
 */
export const aiCrisisCheck = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze the following message from a user on a mental health platform.
      Determine if the user is in an immediate state of crisis, suicidal ideation, or serious self-harm risk.
      
      Respond ONLY in JSON format:
      {
        "isCrisis": boolean,
        "severity": "high" | "medium" | "low" | "none",
        "explanation": "Brief reason for the decision"
      }
      
      Message: "${content}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract JSON from response (handling potential markdown)
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { isCrisis: false, severity: "none", explanation: "Failed to parse AI response" };
  } catch (error) {
    console.error("AI Crisis Check Error:", error);
    return { isCrisis: false, severity: "none", explanation: "AI service error" };
  }
};

/**
 * Main detection function combining keywords and AI
 * @param {string} content - The text to check
 * @param {Object} user - The user who sent the message
 * @param {string} source - Source of message (e.g., 'chat', 'forum')
 * @returns {Promise<{isCrisis: boolean, severity: string}>}
 */
export const detectAndHandleCrisis = async (content, user, source) => {
  // Step 1: Quick keyword check
  const keywordMatch = containsCrisisKeywords(content);
  
  // Step 2: If keywords found OR message is long enough, do AI check
  // We do AI check if keywords are found to reduce false positives
  // OR if no keywords found but it's a long message (potential subtle crisis)
  if (keywordMatch || content.length > 50) {
    const aiResult = await aiCrisisCheck(content);
    
    if (aiResult.isCrisis) {
      await handleCrisisMatch(user, content, source, aiResult.severity);
      return { isCrisis: true, severity: aiResult.severity };
    }
  }

  return { isCrisis: false, severity: "none" };
};

/**
 * Checks if a user's recent mood logs show a negative trend
 * @param {string} userId 
 * @returns {Promise<{isNegativeTrend: boolean, moods: string[]}>}
 */
export const checkMoodTrend = async (userId) => {
  try {
    const recentMoods = await Mood.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3);

    if (recentMoods.length < 3) return { isNegativeTrend: false, moods: [] };

    const negativeMoods = ["Sad", "Stressed"];
    const isNegativeTrend = recentMoods.every(m => negativeMoods.includes(m.mood));

    return { 
      isNegativeTrend, 
      moods: recentMoods.map(m => m.mood) 
    };
  } catch (error) {
    console.error("Mood Trend Check Error:", error);
    return { isNegativeTrend: false, moods: [] };
  }
};

/**
 * Checks if a student has been inactive for more than 3 days
 * @param {Object} user - The student user document
 * @returns {boolean}
 */
export const isInactive = (user) => {
  if (!user.lastActivityDate) return true; // Never logged activity
  
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  return new Date(user.lastActivityDate) < threeDaysAgo;
};

/**
 * Runs a global audit for inactivity and mood trends across all students
 */
export const runGlobalSafetyAudit = async () => {
  try {
    console.log("Starting Global Safety Audit...");
    const students = await User.find({ role: "student" });
    
    for (const student of students) {
      // 1. Check Inactivity
      if (isInactive(student)) {
        await handleCrisisMatch(student, "No activity for 3+ days", "system", "medium");
      }
      
      // 2. Check Mood Trend
      const { isNegativeTrend, moods } = await checkMoodTrend(student._id);
      if (isNegativeTrend) {
        await handleCrisisMatch(student, `Consistent low mood detected: ${moods.join(' -> ')}`, "system", "medium");
      }
    }
    console.log("Global Safety Audit Completed.");
  } catch (error) {
    console.error("Global Safety Audit Error:", error);
  }
};

/**
 * Handles the logic when a crisis is confirmed
 */
export const handleCrisisMatch = async (user, content, source, severity) => {
  try {
    // 0. Cooldown Logic: Check if a log for this user/source exists in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingLog = await CrisisLog.findOne({
      user: user._id,
      source: source,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (existingLog && source === "system") {
      // For automated system checks, we don't want to spam every hour/minute
      return;
    }

    // 1. Log the crisis
    await CrisisLog.create({
      user: user._id,
      trigger: `Crisis detected in ${source}`,
      severity,
      content: content.substring(0, 500),
      source
    });

    // 2. Flag user as at risk
    await User.findByIdAndUpdate(user._id, { isAtRisk: true });

    // 3. Notify Mentor if exists
    if (user.mentor) {
      // Logic from adminRoutes suggests user.mentor could be a User ID or Mentor ID
      // We'll try to notify the recipient.
      await Notification.create({
        recipient: user.mentor,
        message: `ALARM: Crisis keywords detected in your student ${user.name}'s ${source}. Please check in immediately.`,
        type: "crisis",
      });
      
      console.log(`Crisis notification sent to mentor for user ${user.name}`);
    }

    // 4. Also notify admins (optional but recommended)
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        message: `CRITICAL: Crisis detected for student ${user.name} in ${source}.`,
        type: "crisis",
      });
    }
  } catch (error) {
    console.error("Handle Crisis Match Error:", error);
  }
};