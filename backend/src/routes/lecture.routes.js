import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createLecture,
  getLecturesByModule,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controller.js";

import { getAllLectures } from "../controllers/lecture.controller.js";
const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join("uploads", "pdfs");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Create lecture (with optional pdfs upload)
router.post("/", upload.array("pdfs"), createLecture);

// Get lectures by module (route: /api/lectures/module/:moduleId)
router.get("/module/:moduleId", getLecturesByModule);

// Update lecture (with optional new pdfs)
router.put("/:id", upload.array("pdfs"), updateLecture);

// Delete lecture
router.delete("/:id", deleteLecture);

router.get("/", getAllLectures);
export default router;
