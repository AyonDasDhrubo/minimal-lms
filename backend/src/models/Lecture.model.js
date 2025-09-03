import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  pdfs: [String],
});

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
