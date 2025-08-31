import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  pdfs: [{ type: String }],
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
}, { timestamps: true });

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
