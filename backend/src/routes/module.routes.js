import express from "express";
import { Module } from "../models/Module.model.js";

const router = express.Router();

// 📌 Get all modules for a course
router.get("/:courseId", async (req, res) => {
  try {
    const modules = await Module.find({ courseId: req.params.courseId }).sort("number");
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Create new module
// 📌 Create new module
router.post("/", async (req, res) => {
  try {
    const { courseId, title } = req.body;

    // Find the last module number for this course
    const lastModule = await Module.find({ courseId })
      .sort({ number: -1 })
      .limit(1);

    const number = lastModule.length > 0 ? lastModule[0].number + 1 : 1;

    const newModule = new Module({ courseId, title, number });
    await newModule.save();

    res.status(201).json(newModule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// 📌 Delete a module
router.delete("/:id", async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.json({ message: "Module deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
