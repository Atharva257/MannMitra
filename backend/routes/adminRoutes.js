// import express from "express";
// import User from "../models/User.js";
// import Assessment from "../models/Assessment.js";
// import CrisisLog from "../models/CrisisLog.js";
// import protect from "../middleware/authMiddleware.js";
// import adminOnly from "../middleware/adminMiddleware.js";

// const router = express.Router();

// // Get all users
// router.get("/users", protect, adminOnly, async (req, res) => {
//   const users = await User.find().select("-password");
//   res.json(users);
// });

// // Get all assessments
// router.get("/assessments", protect, adminOnly, async (req, res) => {
//   const assessments = await Assessment.find().populate("user", "name email");
//   res.json(assessments);
// });

// // Get crisis logs
// router.get("/crisis", protect, adminOnly, async (req, res) => {
//   const logs = await CrisisLog.find().populate("user", "name email");
//   res.json(logs);
// });

// export default router;

import express from "express";
import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import CrisisLog from "../models/CrisisLog.js";
import Appointment from "../models/Appointment.js";
import Mentor from "../models/Mentor.js"; // new model
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ✅ Existing
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

// ✅ NEW ROUTES

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
  const { mentorId } = req.body;
  const student = await User.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  student.mentor = mentorId;
  await student.save();
  res.json({ message: "Mentor assigned successfully" });
});

// Schedule appointment
router.post("/students/:id/appointments", protect, adminOnly, async (req, res) => {
  const { mentorId, date } = req.body;
  const appt = await Appointment.create({
    student: req.params.id,
    mentor: mentorId,
    date,
    status: "scheduled",
  });
  res.status(201).json(appt);
});

export default router;