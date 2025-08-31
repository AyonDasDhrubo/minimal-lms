import Course from "../models/Course.model.js";

export const createCourse = async (req, res) => {
  try {
    const { thumbnail, title, price, description } = req.body;
    if (!thumbnail || !title || price == null || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const course = await Course.create({ thumbnail, title, price, description });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourses = async (_req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { thumbnail, title, price, description } = req.body;
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { thumbnail, title, price, description },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};
