"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@/types/course";
import { api } from "@/lib/api";
import CourseEditForm from "@/components/CourseEditForm";

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!params.id) return;
        const data = await api.get<Course>(`/api/courses/${params.id}`);
        setCourse(data);
      } catch (err) {
        alert("Failed to load course");
        router.push("/admin/courses");
      }
    };
    fetchCourse();
  }, [params.id, router]);

  if (!course) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
      <CourseEditForm
        initial={course}
        onSaved={() => router.push("/admin/courses")}
      />
    </div>
  );
}
