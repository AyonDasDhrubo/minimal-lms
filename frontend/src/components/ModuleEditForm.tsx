"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Props = {
  id: string;
  initialTitle: string;
  onSaved: (updated: { _id: string; title: string }) => void;
  onCancel?: () => void;
};

export default function ModuleEditForm({ id, initialTitle, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await api.updateModule(id, { title });
      onSaved(updated as any);
    } catch (err) {
      alert((err as Error).message || "Failed to update module");
    } finally {
      setLoading(false);
      onCancel?.();
    }
  };

  return (
    <form onSubmit={handleSave} className="flex gap-2 items-center">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-1 rounded flex-1"
      />
      <button type="submit" disabled={loading} className="px-2 py-1 bg-green-600 text-white rounded">
        Save
      </button>
      <button type="button" onClick={onCancel} className="px-2 py-1 bg-gray-200 rounded">
        Cancel
      </button>
    </form>
  );
}
