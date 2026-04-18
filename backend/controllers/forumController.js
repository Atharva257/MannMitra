import ForumPost from "../models/ForumPost.js";
import { detectAndHandleCrisis } from "../services/safetyService.js";

// @desc Get all posts
// @route GET /api/forum
export const getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};

    const posts = await ForumPost.find(filter)
      .populate("author", "name role")
      .populate("comments.author", "name role")
      .sort({ createdAt: -1 });

    // Sanitize anonymous authors before sending to frontend
    const sanitizedPosts = posts.map(post => {
      const p = post.toObject();
      if (p.isAnonymous && p.author) {
        p.author = { name: "Anonymous User" };
      }
      if (p.comments) {
        p.comments = p.comments.map(c => {
          if (c.isAnonymous && c.author) c.author = { name: "Anonymous User" };
          return c;
        });
      }
      return p;
    });

    res.json(sanitizedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a new post
// @route POST /api/forum
export const createPost = async (req, res) => {
  try {
    const { title, content, category, isAnonymous } = req.body;
    
    // Server-side safety check
    const { isCrisis } = await detectAndHandleCrisis(content, req.user, "forum");
    if (isCrisis) {
      return res.status(400).json({ 
        message: "It sounds like you're going through a lot right now. Please know that you're not alone. If you're in immediate danger, please contact emergency services or a helpline: 988 (US/Canada), 9152987821 (India).",
        crisisDetected: true 
      });
    }

    const newPost = new ForumPost({
      author: req.user.id,
      title,
      content,
      category,
      isAnonymous
    });

    const savedPost = await newPost.save();
    
    // Populate to return the author object properly for UI
    await savedPost.populate("author", "name role");
    
    const postObj = savedPost.toObject();
    if (postObj.isAnonymous) postObj.author = { name: "Anonymous User" };

    res.status(201).json(postObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add a comment to a post
// @route POST /api/forum/:id/comment
export const addComment = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;
    
    // Safety Check
    const { isCrisis } = await detectAndHandleCrisis(content, req.user, "forum");
    if (isCrisis) {
      return res.status(400).json({ 
        message: "It sounds like you're going through a lot right now. Please reach out for help. Emergency services: 988 (US/Canada), 9152987821 (India).",
        crisisDetected: true 
      });
    }

    const post = await ForumPost.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      author: req.user.id,
      content,
      isAnonymous
    });

    await post.save();
    
    await post.populate("comments.author", "name role");
    const newComment = post.comments[post.comments.length - 1].toObject();
    if (newComment.isAnonymous) newComment.author = { name: "Anonymous User" };

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle like on a post
// @route PUT /api/forum/:id/like
export const toggleLike = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(req.user.id);
    if (index === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a post
// @route DELETE /api/forum/:id
export const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.user.role !== "admin" && post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};