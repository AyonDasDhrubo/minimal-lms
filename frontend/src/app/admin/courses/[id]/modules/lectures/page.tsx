"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LectureForm from "@/components/LectureForm";
import LectureEditForm from "@/components/LectureEditForm";

interface Lecture {
  _id: string;
  title: string;
  videoUrl: string;
  pdfs?: string[];
}

const LecturesPage = () => {
  const params = useParams<{ id: string }>();
  const moduleId = params.id;

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchLectures = async () => {
    if (!moduleId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/lectures/module/${moduleId}`);
      if (!res.ok) throw new Error("Failed to fetch lectures");
      const data = await res.json();
      setLectures(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [moduleId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete lecture?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/lectures/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setLectures((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete lecture");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lectures</h1>

      <button onClick={() => setShowForm(s => !s)} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        {showForm ? "Cancel" : "Add Lecture"}
      </button>

      {showForm && <LectureForm moduleId={moduleId} onSuccess={fetchLectures} />}

      <ul className="space-y-4">
        {lectures.map((l) => (
          <li key={l._id} className="border p-4 rounded shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <h2 className="font-semibold text-lg">{l.title}</h2>
                {l.videoUrl && (
                  <div className="mt-2">
                    <iframe className="w-full h-48 rounded" src={l.videoUrl.replace("watch?v=", "embed/")} title={l.title} allowFullScreen></iframe>
                  </div>
                )}
                {l.pdfs && l.pdfs.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">PDFs:</p>
                    <div className="space-y-1">
                      {l.pdfs.map((pdf, idx) => (
                        <a key={idx} href={pdf} target="_blank" rel="noreferrer" className="text-blue-500 underline block">
                          {`PDF ${idx + 1}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-4 flex flex-col gap-2">
                {editingId === l._id ? (
                  <LectureEditForm
                    id={l._id}
                    initialTitle={l.title}
                    initialVideoUrl={l.videoUrl}
                    onSaved={(upd) => { setLectures(prev => prev.map(x => x._id === upd._id ? upd : x)); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <button onClick={() => setEditingId(l._id)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                    <button onClick={() => handleDelete(l._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LecturesPage;
