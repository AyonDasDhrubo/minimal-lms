"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ModuleForm from "@/components/ModuleForm";

interface Module {
  _id: string;
  title: string;
  number: number;
}

const ModulesPage = () => {
  const { id: courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      //const res = await axios.get(`/api/modules?courseId=${courseId}`);
      const res = await axios.get(`http://localhost:5000/api/modules/${courseId}`);

      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (moduleId: string) => {
    try {
      await axios.delete(`/api/modules/${moduleId}`);
      setModules(modules.filter(m => m._id !== moduleId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modules</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {showForm ? "Cancel" : "Add Module"}
      </button>
      {showForm && <ModuleForm courseId={courseId} onSuccess={fetchModules} />}
      <ul className="space-y-2">
        {modules.map(mod => (
          <li key={mod._id} className="flex justify-between items-center border p-2 rounded">
            <span>{mod.number}. {mod.title}</span>
            <button
              onClick={() => handleDelete(mod._id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModulesPage;
