import express from "express";
import { submitAssessment, getHistory } from "../controllers/assessmentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitAssessment);
router.get("/", protect, getHistory);

export default router;
