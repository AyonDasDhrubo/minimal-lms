import mongoose from "mongoose";

// Define a simple schema
const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

// Create the model
const Test = mongoose.model("Test", testSchema);

export default Test;
