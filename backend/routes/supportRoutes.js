import express from "express";
import { handleContactForm } from "../controllers/supportController.js";

const router = express.Router();

router.post("/contact", handleContactForm);

export default router;