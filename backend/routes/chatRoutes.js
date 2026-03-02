import express from "express";
import { chatReply } from "../controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, chatReply);

export default router;
