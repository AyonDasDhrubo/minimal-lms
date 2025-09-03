"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";


type ModuleType = {
  _id: string;
  title: string;
  number: number;
};

type CourseType = {
  _id: string;
  title: string;
  description: string;
};

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const courseId = params.id;

  const [course, setCourse] = useState<CourseType | null>(null);
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      try {
        if (!courseId) throw new Error("No course ID provided");

        // ✅ Fetch course details
        const courseRes = await fetch(`${API_BASE}/api/courses/${courseId}`);
        if (!courseRes.ok) throw new Error("Failed to fetch course");
        const courseData = await courseRes.json();
        setCourse(courseData);

        // ✅ Fetch modules
        const modulesRes = await fetch(`${API_BASE}/api/modules/course/${courseId}`);
        if (!modulesRes.ok) throw new Error("Failed to fetch modules");
        const modulesData = await modulesRes.json();
        setModules(modulesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndModules();
  }, [courseId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Course: {course?.title}</h1>
      <p>{course?.description}</p>

      <h2>Modules:</h2>
      {modules.length === 0 && <p>No modules found.</p>}
      <ul>
        {modules.map((mod) => (
          <li key={mod._id}>
            {mod.number}. {mod.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
