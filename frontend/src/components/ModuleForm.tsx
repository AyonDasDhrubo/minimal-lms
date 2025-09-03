"use client";

import { useState } from "react";
import { api } from "../lib/api";

interface Props {
  courseId: string;
  onSuccess: () => void;
}

const ModuleForm: React.FC<Props> = ({ courseId, onSuccess }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the new api.createModule method
      await api.createModule({ courseId, title });
      setTitle("");
      onSuccess();
    } catch (err) {
      console.error("Error creating module:", err);
      alert("Failed to create module. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input
        type="text"
        placeholder="Module Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Add Module
      </button>
    </form>
  );
};

export default ModuleForm;
