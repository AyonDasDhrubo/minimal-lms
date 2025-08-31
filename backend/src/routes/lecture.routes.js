import express from "express";
import { createLecture, getLecturesByModule, deleteLecture } from "../controllers/lecture.controller.js";

const router = express.Router();

router.post("/", createLecture);
router.get("/module/:moduleId", getLecturesByModule);
router.delete("/:id", deleteLecture);

export default router;
