"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Course } from "@/types/course";
import Link from "next/link";
import UserGuard from "@/components/UserGuard";

export default function UserCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses()
      .then(setCourses)
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
        {loading && <p>Loading courses...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link key={course._id} href={`/user/courses/${course._id}`} className="border rounded-xl shadow hover:shadow-lg p-4 flex flex-col gap-3">
              <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl" />
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-600 line-clamp-3">{course.description}</p>
              <span className="font-bold">৳ {course.price}</span>
            </Link>
          ))}
        </div>
      </div>
    </UserGuard>
  );
}
