import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkAndAwardBadges } from "../services/badgeService.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user with defaults
    const user = await User.create({
      name,
      email,
      password, // Hook handles hashing
      role: "student",
      firstLogin: true,
      assessmentCompleted: false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      firstLogin: user.firstLogin,
      assessmentCompleted: user.assessmentCompleted,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // On first login, mark as no longer firstLogin
    if (user.firstLogin) {
      user.firstLogin = false;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      firstLogin: user.firstLogin,
      assessmentCompleted: user.assessmentCompleted,
      currentStreak: user.currentStreak || 0,
      lastActivityDate: user.lastActivityDate,
      badges: user.badges || [],
      stats: user.stats || {},
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark assessment as completed
// @route PUT /api/users/complete-assessment
// @access Private (student only)
export const completeAssessment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // comes from authMiddleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow students to mark assessment
    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can complete assessment" });
    }

    user.assessmentCompleted = true;
    await user.save();

    res.json({
      message: "Assessment completed successfully",
      assessmentCompleted: user.assessmentCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logActivity = async (req, res) => {
  try {
    const { activityType } = req.body; // e.g. "breathing", "journal", "canvas", "chat", "cbt"
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakUpdated = false;

    // Initial log or consecutive day
    if (!user.lastActivityDate) {
      user.currentStreak = 1;
      user.lastActivityDate = today;
      streakUpdated = true;
    } else {
      const lastActivity = new Date(user.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastActivity.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.currentStreak = (user.currentStreak || 0) + 1;
        user.lastActivityDate = today;
        streakUpdated = true;
      } else if (diffDays > 1) {
        user.currentStreak = 1;
        user.lastActivityDate = today;
        streakUpdated = true;
      }
    }

    // Increment specific activity stats
    if (activityType && user.stats.hasOwnProperty(`${activityType}Count`)) {
      user.stats[`${activityType}Count`] += 1;
    }

    // Check for new badges
    const newBadges = await checkAndAwardBadges(user);

    await user.save();

    res.json({ 
      currentStreak: user.currentStreak, 
      streakUpdated, 
      newBadges, 
      stats: user.stats 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};