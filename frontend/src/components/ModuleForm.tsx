"use client";

import { useState } from "react";
//import axios from "axios";
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
      await api.post("/api/modules", { courseId, title });
      setTitle("");
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input
        type="text"
        placeholder="Module Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Add Module
      </button>
    </form>
  );
};

export default ModuleForm;
