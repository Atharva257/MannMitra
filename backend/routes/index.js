import express from "express";
import userRoutes from "./userRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import contactRoutes from "./contactRoutes.js";
import chatRoutes from "./chatRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/contacts", contactRoutes);
router.use("/chat", chatRoutes);
router.use("/admin", adminRoutes);

export default router;