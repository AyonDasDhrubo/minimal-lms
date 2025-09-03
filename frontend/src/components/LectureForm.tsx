"use client";

import { useState } from "react";
import { api } from "../lib/api";

interface Props {
  moduleId: string;
  onSuccess: () => void;
}

const LectureForm: React.FC<Props> = ({ moduleId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfs, setPdfs] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!moduleId) {
      console.error("Module ID is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("videoUrl", videoUrl);
    formData.append("module", moduleId); // must match backend field name

    if (pdfs) {
      Array.from(pdfs).forEach((file) => formData.append("pdfs", file));
    }

    try {
      setLoading(true);
      await api.createLecture(formData); // only pass FormData
      setTitle("");
      setVideoUrl("");
      setPdfs(null);
      onSuccess();
    } catch (err) {
      console.error("Error creating lecture:", err);
      alert("Failed to create lecture. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="Lecture Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="YouTube Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={(e) => setPdfs(e.target.files)}
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 text-white rounded transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Adding Lecture..." : "Add Lecture"}
      </button>
    </form>
  );
};

export default LectureForm;
