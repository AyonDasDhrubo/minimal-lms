import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: { type: String, required: true },
  number: { type: Number, required: true },
});

export const Module = mongoose.model("Module", moduleSchema);
