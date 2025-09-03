// D:\Minimal LMS System\frontend\src\components\LectureEditForm.tsx
"use client";

import { useState } from "react";

type Props = {
  id: string;
  initialTitle: string;
  initialVideoUrl: string;
  initialPdfs?: string[];
  onSaved: (updated: any) => void;
  onCancel?: () => void;
};

export default function LectureEditForm({ id, initialTitle, initialVideoUrl, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [pdfs, setPdfs] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("videoUrl", videoUrl);
      if (pdfs) {
        Array.from(pdfs).forEach((f) => fd.append("pdfs", f));
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/lectures/${id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update lecture");
      }

      const data = await res.json();
      onSaved(data);
    } catch (err) {
      alert((err as Error).message || "Failed to update lecture");
    } finally {
      setLoading(false);
      onCancel?.();
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded w-full" />
      <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="border p-2 rounded w-full" />
      <input type="file" multiple accept=".pdf" onChange={(e) => setPdfs(e.target.files)} />
      <div className="flex gap-2">
        <button disabled={loading} type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
      </div>
    </form>
  );
}
