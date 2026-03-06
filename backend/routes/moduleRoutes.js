import express from "express";
import Module from "../models/Module.js";
import ModuleProgress from "../models/ModuleProgress.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all modules
router.get("/", protect, async (req, res) => {
    try {
        const modules = await Module.find();
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get module by ID with progress
router.get("/:id", protect, async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ message: "Module not found" });

        const progress = await ModuleProgress.findOne({
            user: req.user._id,
            module: req.params.id,
        });

        res.json({ module, progress: progress || { completedSections: [], isCompleted: false } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update progress
router.post("/:id/progress", protect, async (req, res) => {
    const { sectionOrder } = req.body;
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ message: "Module not found" });

        let progress = await ModuleProgress.findOne({
            user: req.user._id,
            module: req.params.id,
        });

        if (!progress) {
            progress = new ModuleProgress({
                user: req.user._id,
                module: req.params.id,
                completedSections: [],
            });
        }

        if (!progress.completedSections.includes(sectionOrder)) {
            progress.completedSections.push(sectionOrder);
        }

        // Check if fully completed
        if (progress.completedSections.length === module.sections.length) {
            progress.isCompleted = true;
        }

        progress.lastAccessed = Date.now();
        await progress.save();

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;