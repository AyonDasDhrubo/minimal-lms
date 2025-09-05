"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ModuleForm from "@/components/ModuleForm";
import ModuleEditForm from "@/components/ModuleEditForm";
import LectureForm from "@/components/LectureForm";
import { api } from "@/lib/api";

type ModuleType = {
  _id: string;
  title: string;
  number: number;
};

type LectureType = {
  _id: string;
  title: string;
  videoUrl: string;
  pdfs?: string[];
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id;

  const [modules, setModules] = useState<ModuleType[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [lectures, setLectures] = useState<LectureType[]>([]);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const fetchModules = async () => {
    try {
      const res = await api.getModules(courseId);
      setModules(res as ModuleType[]);
      if ((res as ModuleType[]).length > 0 && !selectedModule)
        setSelectedModule((res as ModuleType[])[0]._id);
    } catch (err) {
      console.error("fetchModules:", err);
    }
  };

  const fetchLectures = async (moduleId: string) => {
    try {
      const res = await api.getLecturesByModule(moduleId);
      setLectures(res as LectureType[]);
    } catch (err) {
      console.error("fetchLectures:", err);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    fetchModules();
  }, [courseId]);

  useEffect(() => {
    if (!selectedModule) return;
    fetchLectures(selectedModule);
  }, [selectedModule]);

  const handleModuleAdded = () => fetchModules();

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Delete module?")) return;
    try {
      await api.delete(`/api/modules/${id}`);
      setModules((m) => m.filter((mod) => mod._id !== id));
      if (selectedModule === id) setSelectedModule("");
    } catch (err) {
      alert("Failed to delete module");
    }
  };

  const handleModuleSaved = (updated: any) => {
    setModules((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
    setEditingModuleId(null);
  };

  const handleDeleteLecture = async (id: string) => {
    if (!confirm("Delete lecture?")) return;
    try {
      await api.delete(`/api/lectures/${id}`);
      setLectures((l) => l.filter((lec) => lec._id !== id));
    } catch (err) {
      alert("Failed to delete lecture");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Course Modules</h1>

      <div className="flex gap-4">
        {/* Module Section */}
        <div className="w-1/3 border-r pr-4">
          <ModuleForm courseId={courseId} onSuccess={handleModuleAdded} />
          <h2 className="font-semibold mb-2 mt-4">Modules</h2>

          {modules.length === 0 && <p>No modules yet</p>}

          {modules.map((mod) => (
            <div key={mod._id} className="mb-2">
              {editingModuleId === mod._id ? (
                <ModuleEditForm
                  id={mod._id}
                  initialTitle={mod.title}
                  onSaved={handleModuleSaved}
                  onCancel={() => setEditingModuleId(null)}
                />
              ) : (
                <div
                  className={`p-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedModule === mod._id ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    onClick={() => setSelectedModule(mod._id)}
                    className="cursor-pointer flex-1"
                  >
                    {mod.number}. {mod.title}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingModuleId(mod._id)}
                      className="px-2 py-1 bg-yellow-400 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteModule(mod._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lecture Section */}
        <div className="w-2/3 pl-4">
          {selectedModule ? (
            <>
              <LectureForm
                moduleId={selectedModule}
                onSuccess={() => fetchLectures(selectedModule)}
              />
              <h2 className="font-semibold mb-2 mt-4">Lectures</h2>

              {lectures.length === 0 ? (
                <p>No lectures available</p>
              ) : (
                <ul>
                  {lectures.map((lec) => (
                    <li
                      key={lec._id}
                      className="p-2 border-b flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <strong>{lec.title}</strong>
                        <button
                          onClick={() => handleDeleteLecture(lec._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Video Embed */}
                      {lec.videoUrl && (
                        <div className="mt-1">
                          <iframe
                            width="100%"
                            height="200"
                            src={lec.videoUrl.replace("watch?v=", "embed/")}
                            title={lec.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}

                      {/* PDF List */}
                      {lec.pdfs && lec.pdfs.length > 0 && (
                        <div className="mt-1">
                          <strong>PDFs:</strong>
                          <ul className="list-disc list-inside">
                            {lec.pdfs.map((pdf, idx) => (
                              <li key={idx}>
                                <a
                                  href={pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  {pdf.split("/").pop()}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p>Select a module to manage lectures</p>
          )}
        </div>
      </div>
    </div>
  );
}
