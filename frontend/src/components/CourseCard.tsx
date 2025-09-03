"use client";
import Link from "next/link";
import { Course } from "@/types/course";

type Props = { course: Course; onDelete?: (id: string) => void };

export default function CourseCard({ course, onDelete }: Props) {
  return (
    <div className="rounded-2xl shadow p-4 border flex flex-col gap-3">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-40 object-cover rounded-xl"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {course.description}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold">৳ {course.price}</span>
        <div className="flex gap-2">
          <Link
            href={`/admin/courses/${course._id}`}
            className="px-3 py-1 rounded-lg border hover:bg-gray-50"
          >
            Manage
          </Link>
          <Link
            href={`/admin/courses/${course._id}/edit`}
            className="px-3 py-1 rounded-lg border text-blue-600 hover:bg-blue-50"
          >
            Edit
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(course._id)}
              className="px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
