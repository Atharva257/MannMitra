import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";
import { createMeeting } from "../services/googleCalendarService.js";

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

        try {
            const { link, eventId } = await createMeeting(
                `Session: ${student.name} & ${req.user.name}`,
                date,
                30
            );

            const session = await Session.create({
                student: studentId,
                mentor: req.user.id,
                scheduledAt: date,
                meetingLink: link,
                calendarEventId: eventId,
            });

            res.status(201).json(session);
        } catch (error) {
            console.error("Failed to create Google Meet link", error);
            res.status(500).json({ message: "Failed to generate meeting link" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;