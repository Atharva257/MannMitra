import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET Assigned Students
router.get("/students", protect, requireRole("mentor"), async (req, res) => {
    try {
        const students = await User.find({ mentor: req.user.id, role: "student" }).select("-password");
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Mentor Sessions
router.get("/sessions", protect, requireRole("mentor"), async (req, res) => {
    try {
        const sessions = await Session.find({ mentor: req.user.id })
            .populate("student", "name email")
            .sort({ scheduledAt: 1 });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST Schedule Session (Mentor scheduling for assigned student)
router.post("/schedule", protect, requireRole("mentor"), async (req, res) => {
    try {
        const { studentId, date } = req.body;

        // Verify student is assigned to this mentor
        const student = await User.findOne({ _id: studentId, mentor: req.user.id });
        if (!student) return res.status(403).json({ message: "Student not assigned to you" });

        const session = await Session.create({
            student: studentId,
            mentor: req.user.id,
            scheduledAt: date,
            meetingRoomId: `mm-${uuidv4().slice(0, 8)}`,
        });

        res.status(201).json(session);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;