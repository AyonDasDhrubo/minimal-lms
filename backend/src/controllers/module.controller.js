// D:\Minimal LMS System\backend\src\controllers\module.controller.js
import Module from "../models/Module.model.js";

// Create module
export const createModule = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    // compute number (auto-increment per course)
    const lastModule = await Module.find({ courseId }).sort({ number: -1 }).limit(1);
    const number = lastModule.length > 0 ? lastModule[0].number + 1 : 1;

    const newModule = await Module.create({ title, courseId, number });
    res.status(201).json(newModule);
  } catch (err) {
    console.error("createModule:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get modules by course
export const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const modules = await Module.find({ courseId }).sort({ number: 1 });
    res.status(200).json(modules);
  } catch (err) {
    console.error("getModulesByCourse:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update module
export const updateModule = async (req, res) => {
  try {
    const { title } = req.body;
    const updated = await Module.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Module not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("updateModule:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete module
export const deleteModule = async (req, res) => {
  try {
    const deleted = await Module.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Module not found" });
    res.status(200).json({ message: "Module deleted" });
  } catch (err) {
    console.error("deleteModule:", err);
    res.status(500).json({ message: err.message });
  }
};
