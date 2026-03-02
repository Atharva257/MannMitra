import express from "express";
import { addContact, getContacts } from "../controllers/contactController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addContact);
router.get("/", protect, getContacts);

export default router;
