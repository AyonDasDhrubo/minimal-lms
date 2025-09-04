"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import CourseCard from "@/components/CourseCard";
import CourseForm from "@/components/CourseForm";
import { API_BASE } from "@/lib/api";
import AdminGuard from "@/components/AdminGuard";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/courses`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("fetchCourses error:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSaved = (_course: Course) => {
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCourses();
      else alert("Delete failed");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  // 🔑 Logout
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  return (
    <AdminGuard>
      <div className="p-6">
        {/* Header with logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin: Courses</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Course Form */}
        <div className="mb-6">
          <div className="max-w-lg">
            <CourseForm onSaved={handleSaved} />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c._id} course={c} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}
