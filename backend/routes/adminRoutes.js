import express from "express";
import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import CrisisLog from "../models/CrisisLog.js";
import Appointment from "../models/Appointment.js";
import Session from "../models/Session.js";
import { v4 as uuidv4 } from "uuid";
import Mentor from "../models/Mentor.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import { createMeeting } from "../services/googleCalendarService.js";

const router = express.Router();

// Existing
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.get("/assessments", protect, adminOnly, async (req, res) => {
  const assessments = await Assessment.find().populate("user", "name email");
  res.json(assessments);
});

router.get("/crisis", protect, adminOnly, async (req, res) => {
  const logs = await CrisisLog.find().populate("user", "name email");
  res.json(logs);
});

import bcrypt from "bcryptjs";

// ... existing code ...

// NEW ROUTES

// Register a new mentor (Admin only)
router.post("/mentors", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // 1. Create User record
    const user = await User.create({
      name,
      email,
      password, // Hook will handle hashing
      role: "mentor",
      firstLogin: false, // Mentors don't necessarily need the "first login" flow like students
      assessmentCompleted: true,
    });

    // 2. Create Mentor record
    const mentor = await Mentor.create({
      name,
      email,
      specialization,
      approved: true, // Auto-approved since admin created them
    });

    res.status(201).json({
      message: "Mentor registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      mentor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single student by ID
router.get("/students/:id", protect, adminOnly, async (req, res) => {
  const student = await User.findById(req.params.id).select("-password");
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

// Get student’s assessments
router.get("/students/:id/assessments", protect, adminOnly, async (req, res) => {
  const assessments = await Assessment.find({ user: req.params.id });
  res.json(assessments);
});

// Get student’s appointments
router.get("/students/:id/appointments", protect, adminOnly, async (req, res) => {
  const appointments = await Appointment.find({ student: req.params.id }).populate("mentor", "name specialization");
  res.json(appointments);
});

// Get student’s trusted contacts
router.get("/students/:id/trusted-contacts", protect, adminOnly, async (req, res) => {
  const student = await User.findById(req.params.id).populate("trustedContacts");
  res.json(student.trustedContacts || []);
});

// Get all mentors
router.get("/mentors", protect, adminOnly, async (req, res) => {
  const mentors = await Mentor.find();
  res.json(mentors);
});

// Assign mentor to student
router.put("/students/:id/assign-mentor", protect, adminOnly, async (req, res) => {
  try {
    const { mentorId } = req.body;
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Find the corresponding User record for this mentor to ensure dashboard compatibility
    const mentorRecord = await Mentor.findById(mentorId);
    if (mentorRecord) {
      const mentorUser = await User.findOne({ email: mentorRecord.email });
      if (mentorUser) {
        student.mentor = mentorUser._id;
      } else {
        student.mentor = mentorId; // Fallback to Mentor ID if no user account yet
      }
    } else {
      student.mentor = mentorId;
    }

    await student.save();
    res.json({ message: "Mentor assigned successfully", mentorId: student.mentor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Schedule appointment
router.post("/students/:id/appointments", protect, adminOnly, async (req, res) => {
  const { mentorId, date } = req.body;

  const student = await User.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const mentorRecord = await Mentor.findById(mentorId);
  if (!mentorRecord) return res.status(404).json({ message: "Mentor not found" });

  const mentorUser = await User.findOne({ email: mentorRecord.email });
  if (!mentorUser) return res.status(404).json({ message: "Mentor user account not found" });

  // Create Appointment (Legacy/Tracking)
  const appt = await Appointment.create({
    student: req.params.id,
    mentor: mentorId,
    date,
    status: "scheduled",
  });

  if (mentorUser) {
    try {
      // Create Google Meet link
      const { link, eventId } = await createMeeting(
        `Session: ${student.name} & ${mentorRecord.name}`,
        date,
        30
      );

      await Session.create({
        student: req.params.id,
        mentor: mentorUser._id,
        scheduledAt: date,
        meetingLink: link,
        calendarEventId: eventId,
      });
    } catch (error) {
      console.error("Failed to create Google Meet link", error);
      // Fallback or handle error
    }
  }

  res.status(201).json(appt);
});

// GET all appointments (Global)
router.get("/all-appointments", protect, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("student", "name email")
      .populate("mentor", "name specialization");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW: Admin Dashboard Stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [studentCount, mentorCount, pendingAssessments, avgScoreResult] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "mentor" }),
      User.countDocuments({ role: "student", assessmentCompleted: false }),
      Assessment.aggregate([{ $group: { _id: null, avgScore: { $avg: "$score" } } }])
    ]);

    const averagePhqScore = avgScoreResult.length > 0 ? parseFloat(avgScoreResult[0].avgScore.toFixed(1)) : 0;

    res.json({
      totalStudents: studentCount,
      totalMentors: mentorCount,
      pendingAssessments,
      averagePhqScore
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW: Allotment Logs
router.get("/allotments", protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: "student", mentor: { $ne: null } })
      .select("name email mentor")
      .populate({
        path: "mentor",
        model: "Mentor",
        select: "name specialization"
      });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;