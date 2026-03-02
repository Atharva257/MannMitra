const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { v4: uuidv4 } = require("uuid");

// ADMIN - Schedule Session
router.post(
  "/schedule",
  verifyToken,
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
  verifyToken,
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
  verifyToken,
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

module.exports = router;