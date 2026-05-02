import express from "express";
import { getPosts, createPost, addComment, toggleLike, deletePost } from "../controllers/forumController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts); // Public: anyone can read posts
router.post("/", protect, createPost);
router.post("/:id/comment", protect, addComment);
router.put("/:id/like", protect, toggleLike);
router.delete("/:id", protect, deletePost);

export default router;
