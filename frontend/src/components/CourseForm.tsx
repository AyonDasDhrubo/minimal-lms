"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Course } from "@/types/course";

type Props = { initial?: Partial<Course>; onSaved?: (course: Course) => void };

export default function CourseForm({ initial = {}, onSaved }: Props) {
  const [thumbnail, setThumbnail] = useState(initial.thumbnail ?? "");
  const [title, setTitle] = useState(initial.title ?? "");
  const [price, setPrice] = useState<number>(Number(initial.price ?? 0));
  const [description, setDescription] = useState(initial.description ?? "");
  const [loading, setLoading] = useState(false);
  const editing = Boolean(initial._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { thumbnail, title, price, description };
      const course = editing
        ? await api.put<Course>(`/api/courses/${initial._id}`, payload)
        : await api.post<Course>("/api/courses", payload);
      onSaved?.(course);
      setThumbnail("");
      setTitle("");
      setPrice(0);
      setDescription("");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <input className="border rounded-xl p-2" placeholder="Thumbnail URL" value={thumbnail} onChange={(e)=>setThumbnail(e.target.value)} required />
      <input className="border rounded-xl p-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
      <input className="border rounded-xl p-2" type="number" placeholder="Price" value={price} onChange={(e)=>setPrice(Number(e.target.value))} required />
      <textarea className="border rounded-xl p-2 min-h-24" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} required />
      <button disabled={loading} className="rounded-2xl px-4 py-2 bg-black text-white disabled:opacity-60">{editing ? "Update Course" : "Create Course"}</button>
    </form>
  );
}
