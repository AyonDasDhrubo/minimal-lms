import Lecture from "../models/Lecture.model.js";

// Create lecture
export const createLecture = async (req, res) => {
  try {
    const { title, videoUrl, pdfs, module } = req.body;
    const newLecture = await Lecture.create({ title, videoUrl, pdfs, module });
    res.status(201).json(newLecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get lectures by module
export const getLecturesByModule = async (req, res) => {
  try {
    const lectures = await Lecture.find({ module: req.params.moduleId });
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete lecture
export const deleteLecture = async (req, res) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ message: "Lecture deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
