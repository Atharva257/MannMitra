import express from "express";
import Session from "../models/Session.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// ADMIN - Schedule Session
router.post(
  "/schedule",
  protect,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { studentId, mentorId, scheduledAt, duration } = req.body;

      const session = new Session({
        student: studentId,
        mentor: mentorId,
        scheduledAt,
        duration,
        meetingRoomId: uuidv4(),
      });

      await session.save();

      res.status(201).json({
        message: "Session scheduled successfully",
        session,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// STUDENT - Get My Sessions
router.get(
  "/student",
  protect,
  requireRole("student"),
  async (req, res) => {
    try {
      const sessions = await Session.find({
        student: req.user.id,
      }).populate("mentor", "name email");

      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// MENTOR - Get My Sessions
router.get(
  "/mentor",
  protect,
  requireRole("mentor"),
  async (req, res) => {
    try {
      const sessions = await Session.find({
        mentor: req.user.id,
      }).populate("student", "name email");

      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET Active Session (Student or Mentor)
router.get(
  "/active",
  protect,
  async (req, res) => {
    try {
      const query = req.user.role === "mentor" ? { mentor: req.user.id } : { student: req.user.id };
      const session = await Session.findOne({
        ...query,
        status: "scheduled"
      }).sort({ scheduledAt: 1 });

      if (!session) return res.status(404).json({ message: "No active session found" });
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;