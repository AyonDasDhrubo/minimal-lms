"use client";

import { useState } from "react";
import { Course } from "@/types/course";
import { api } from "@/lib/api";

interface CourseEditFormProps {
  initial: Course;
  onSaved: () => void;
}

export default function CourseEditForm({ initial, onSaved }: CourseEditFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(initial.price);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      // Use api.putJson for JSON update; adjust if your backend supports FormData for file upload
      await api.updateCourse(initial._id, {
        title,
        description,
        price,
        thumbnail: thumbnail ? URL.createObjectURL(thumbnail) : initial.thumbnail,
      });
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <label className="block font-semibold">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <label className="block font-semibold">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save
      </button>
    </form>
  );
}
