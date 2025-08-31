"use client";
import { useEffect, useState } from "react";
import { Course } from "@/types/course";
import CourseCard from "@/components/CourseCard";
import CourseForm from "@/components/CourseForm";
import { API_BASE } from "@/lib/api";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    const res = await fetch(`${API_BASE}/api/courses`, { cache: "no-store" });
    const data = await res.json();
    setCourses(data);
  };

  useEffect(()=>{ fetchCourses(); }, []);

  const handleSaved = (course: Course) => {
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    const res = await fetch(`${API_BASE}/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) fetchCourses();
    else alert("Delete failed");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Courses</h1>
      <div className="mb-6">
        <div className="max-w-lg">
          <CourseForm onSaved={handleSaved} />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => <CourseCard key={c._id} course={c} onDelete={handleDelete} />)}
      </div>
    </div>
  );
}
