import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Test from "./models/TestModel.js"; // import the model

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server running!");
});

// Test route to create a document
app.post("/test", async (req, res) => {
  try {
    const test = new Test({ name: "Ayon", age: 25 });
    const saved = await test.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route to get all documents
app.get("/test", async (req, res) => {
  try {
    const all = await Test.find();
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
