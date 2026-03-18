import express from "express";
import userRoutes from "./userRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import contactRoutes from "./contactRoutes.js";
import chatRoutes from "./chatRoutes.js";
import adminRoutes from "./adminRoutes.js";
import mentorRoutes from "./mentorRoutes.js";
import sessionRoutes from "./sessionRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import moduleRoutes from "./moduleRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/contacts", contactRoutes);
router.use("/chat", chatRoutes);
router.use("/admin", adminRoutes);
router.use("/mentor", mentorRoutes);
router.use("/sessions", sessionRoutes);
router.use("/notifications", notificationRoutes);
router.use("/modules", moduleRoutes);

export default router;