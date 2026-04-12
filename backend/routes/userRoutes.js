import express from "express";
import { registerUser, loginUser, completeAssessment, getProfile, logActivity } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/complete-assessment", protect, completeAssessment);
router.put("/log-activity", protect, logActivity);

export default router;