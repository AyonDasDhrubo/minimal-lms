import Lecture from "../models/Lecture.model.js";

// Create lecture
export const createLecture = async (req, res) => {
  try {
    // Note: multer placed uploaded files on req.files
    const { title, videoUrl } = req.body;

    // backend expects module id in `module` field (string)
    const module = req.body.module || req.body.moduleId;
    if (!module) return res.status(400).json({ error: "Module ID is required" });

    const pdfs = req.files ? req.files.map(f => `/uploads/pdfs/${f.filename}`) : [];

    const lecture = await Lecture.create({ title, videoUrl, module, pdfs });
    res.status(201).json(lecture);
  } catch (err) {
    console.error("createLecture:", err);
    res.status(500).json({ error: "Failed to create lecture" });
  }
};

// Get lectures by module
export const getLecturesByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const lectures = await Lecture.find({ module: moduleId }).sort({ createdAt: -1 });
    res.status(200).json(lectures);
  } catch (err) {
    console.error("getLecturesByModule:", err);
    res.status(500).json({ error: "Failed to fetch lectures" });
  }
};

// Update lecture
export const updateLecture = async (req, res) => {
  try {
    const { title, videoUrl } = req.body;
    // if PDFs uploaded, replace pdfs with new uploaded paths; otherwise keep existing
    const pdfs = req.files && req.files.length > 0
      ? req.files.map(f => `/uploads/pdfs/${f.filename}`)
      : undefined; // undefined so we don't overwrite if no files sent

    const updateObj = { title, videoUrl };
    if (pdfs !== undefined) updateObj.pdfs = pdfs;

    const updated = await Lecture.findByIdAndUpdate(req.params.id, updateObj, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Lecture not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("updateLecture:", err);
    res.status(500).json({ error: "Failed to update lecture" });
  }
};

// Delete lecture
export const deleteLecture = async (req, res) => {
  try {
    const deleted = await Lecture.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Lecture not found" });
    res.status(200).json({ message: "Lecture deleted" });
  } catch (err) {
    console.error("deleteLecture:", err);
    res.status(500).json({ error: "Failed to delete lecture" });
  }
};

// Get all lectures with module & course info
export const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate({
        path: "module",
        select: "title number courseId",
        populate: { path: "courseId", select: "title" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(lectures);
  } catch (err) {
    console.error("getAllLectures:", err);
    res.status(500).json({ error: "Failed to fetch lectures" });
  }
};
