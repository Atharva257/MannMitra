import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Assessment from "../models/Assessment.js";
import Mentor from "../models/Mentor.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";
import { createMeeting } from "../services/googleCalendarService.js";

const router = express.Router();

// GET Assigned Students
router.get("/students", protect, requireRole("mentor"), async (req, res) => {
    try {
        // Find both IDs that could be assigned to a student
        const mentorRecord = await Mentor.findOne({ email: req.user.email });
        
        const students = await User.find({ 
            role: "student", 
            $or: [
                { mentor: req.user.id },
                { mentor: mentorRecord?._id }
            ]
        })
            .populate("modules", "title category")
            .select("-password");
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Mentor Sessions
router.get("/sessions", protect, requireRole("mentor"), async (req, res) => {
    try {
        const mentorRecord = await Mentor.findOne({ email: req.user.email });
        const sessions = await Session.find({ 
            $or: [
                { mentor: req.user.id },
                { mentor: mentorRecord?._id }
            ]
        })
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
        const mentorRecord = await Mentor.findOne({ email: req.user.email });

        // Verify student is assigned to this mentor
        const student = await User.findOne({ 
            _id: studentId, 
            $or: [
                { mentor: req.user.id },
                { mentor: mentorRecord?._id }
            ]
        });
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

// PUT Update Session Notes
router.put("/sessions/:id/notes", protect, requireRole("mentor"), async (req, res) => {
    try {
        const { notes } = req.body;
        const session = await Session.findOneAndUpdate(
            { _id: req.params.id, mentor: req.user.id },
            { notes },
            { new: true }
        );
        if (!session) return res.status(404).json({ message: "Session not found" });
        res.json(session);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT Toggle Student At-Risk Flag
router.put("/students/:id/risk", protect, requireRole("mentor"), async (req, res) => {
    try {
        const { isAtRisk } = req.body;
        const mentorRecord = await Mentor.findOne({ email: req.user.email });

        const student = await User.findOneAndUpdate(
            { 
                _id: req.params.id, 
                $or: [
                    { mentor: req.user.id },
                    { mentor: mentorRecord?._id }
                ]
            },
            { isAtRisk },
            { new: true }
        ).select("-password");
        if (!student) return res.status(404).json({ message: "Student not found or not assigned to you" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Individual Student Detail (Mentor version)
router.get("/students/:id", protect, requireRole("mentor"), async (req, res) => {
    try {
        const mentorRecord = await Mentor.findOne({ email: req.user.email });
        const student = await User.findOne({ 
            _id: req.params.id, 
            $or: [
                { mentor: req.user.id },
                { mentor: mentorRecord?._id }
            ]
        })
            .populate("modules", "title category")
            .select("-password");
        if (!student) return res.status(404).json({ message: "Student not found or not assigned to you" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Student Assessments (Mentor version)
router.get("/students/:id/assessments", protect, requireRole("mentor"), async (req, res) => {
    try {
        const mentorRecord = await Mentor.findOne({ email: req.user.email });
        // Verify assignment
        const exists = await User.exists({ 
            _id: req.params.id, 
            $or: [
                { mentor: req.user.id },
                { mentor: mentorRecord?._id }
            ]
        });
        if (!exists) return res.status(403).json({ message: "Access denied" });

        const assessments = await Assessment.find({ user: req.params.id }).sort({ date: -1 });
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;