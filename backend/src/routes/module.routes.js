import express from "express";
import {
  createModule,
  getModulesByCourse,
  updateModule,
  deleteModule,
} from "../controllers/module.controller.js";

const router = express.Router();

// Get modules by course
router.get("/course/:courseId", getModulesByCourse);

// Create module
router.post("/", createModule);

// Update module
router.put("/:id", updateModule);

// Delete module
router.delete("/:id", deleteModule);

export default router;
