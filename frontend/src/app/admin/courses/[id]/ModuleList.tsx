"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Module = {
  _id: string;
  title: string;
  number: number;
  courseId: string;
};

export default function ModuleList({ courseId }: { courseId: string }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const data = await api.getModules<Module[]>(courseId);
      setModules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      await api.deleteModule(id);
      setModules((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete module");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Modules</h2>
      {loading ? (
        <p>Loading...</p>
      ) : modules.length === 0 ? (
        <p className="text-gray-500">No modules yet</p>
      ) : (
        <ul className="space-y-2">
          {modules.map((m) => (
            <li
              key={m._id}
              className="flex justify-between items-center border rounded p-2"
            >
              <span>
                <b>Module {m.number}:</b> {m.title}
              </span>
              <button
                onClick={() => handleDelete(m._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
