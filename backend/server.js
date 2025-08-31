import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import courseRoutes from "./src/routes/courseRoutes.js";
import moduleRoutes from "./src/routes/module.routes.js";
import lectureRoutes from "./src/routes/lecture.routes.js";


dotenv.config();
const app = express();

// Middlewares
app.use(cors());               // Enable frontend-backend communication
app.use(express.json());       // Parse JSON request bodies

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lectures", lectureRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.log(err));

// Base route
app.get("/", (req, res) => {
  res.send("Server running!");
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
