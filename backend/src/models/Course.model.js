import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    thumbnail: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
