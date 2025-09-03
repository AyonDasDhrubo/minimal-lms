import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Module {
  _id: string;
  title: string;
}

const AddLecture: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");

  // Fetch modules from backend
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/modules");
        setModules(res.data);
        if (res.data.length > 0) setSelectedModule(res.data[0]._id);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
      }
    };
    fetchModules();
  }, []);

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPdfs(Array.from(e.target.files));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedModule) {
      alert("Please select a module");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("videoUrl", videoUrl);
    formData.append("module", selectedModule);
    pdfs.forEach((pdf) => formData.append("pdfs", pdf));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/lectures",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Lecture created:", response.data);
      alert("Lecture added successfully!");
      // Reset form
      setTitle("");
      setVideoUrl("");
      setPdfs([]);
    } catch (err) {
      console.error("Error creating lecture:", err);
      alert("Failed to create lecture");
    }
  };

  return (
    <div className="add-lecture-container">
      <h2>Add Lecture</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Lecture Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Video URL (YouTube)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          required
          className="border p-2 rounded"
        >
          {modules.map((mod) => (
            <option key={mod._id} value={mod._id}>
              {mod.title}
            </option>
          ))}
        </select>

        <input
          type="file"
          multiple
          onChange={handlePdfChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Lecture
        </button>
      </form>
    </div>
  );
};

export default AddLecture;
