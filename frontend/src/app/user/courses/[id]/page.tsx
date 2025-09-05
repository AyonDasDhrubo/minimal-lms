"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Course } from "@/types/course";
import { Module, Lecture } from "@/types/lecture";
import UserGuard from "@/components/UserGuard";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lectures, setLectures] = useState<{ [key: string]: Lecture[] }>({});
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [completedLectures, setCompletedLectures] = useState<string[]>([]);

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`course-progress-${id}`);
    if (stored) setCompletedLectures(JSON.parse(stored));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchCourseAndContent = async () => {
      try {
        const courseData = await api.getCourse(id);
        setCourse(courseData);

        const modulesData = await api.getModules(id);
        setModules(modulesData);

        const lecturesMap: { [key: string]: Lecture[] } = {};
        for (const module of modulesData) {
          const moduleLectures = await api.getLecturesByModule(module._id);
          lecturesMap[module._id] = moduleLectures;
        }
        setLectures(lecturesMap);
      } catch (err: any) {
        alert(err.message || "Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndContent();
  }, [id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModuleId(prev => (prev === moduleId ? null : moduleId));
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, idx) =>
      regex.test(part) ? (
        <span key={idx} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  const markLectureComplete = (lectureId: string) => {
    const newCompleted = [...completedLectures, lectureId];
    setCompletedLectures(newCompleted);
    localStorage.setItem(`course-progress-${id}`, JSON.stringify(newCompleted));
  };

  if (loading) return <p className="p-6">Loading course...</p>;
  if (!course) return <p className="p-6">Course not found.</p>;

  // Filter lectures based on search
  const filteredModules = modules.map(module => {
    const moduleLectures = lectures[module._id] || [];
    const filteredLectures = moduleLectures.filter(lec =>
      lec.title.toLowerCase().includes(search.toLowerCase())
    );
    return { ...module, filteredLectures };
  });

  // Calculate progress
  const totalLectures = Object.values(lectures).reduce((acc, arr) => acc + arr.length, 0);
  const completedCount = completedLectures.length;
  const progressPercent = totalLectures ? (completedCount / totalLectures) * 100 : 0;
  return (
    <UserGuard>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover rounded-xl" />
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-gray-700">{course.description}</p>
        <p className="text-xl font-bold">Price: ৳ {course.price}</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-4"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{completedCount} / {totalLectures} lectures completed</p>
        </div>

        {/* Modules & Lectures */}
        <section>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Course Content</h2>
          <input
            type="text"
            placeholder="Search lectures..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <div className="space-y-4">
            {filteredModules.map(module => (
              <div key={module._id} className="border rounded p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleModule(module._id)}
                >
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  <span>{expandedModuleId === module._id ? "▲" : "▼"}</span>
                </div>

                {expandedModuleId === module._id && (
                  <div className="mt-2 space-y-2">
                    {module.filteredLectures.length === 0 && <p>No lectures available</p>}
                    {module.filteredLectures.map((lec, idx) => {
                      const prevLectureId = idx > 0 ? module.filteredLectures[idx - 1]._id : null;
                      const isUnlocked =
                        idx === 0 || completedLectures.includes(prevLectureId!);

                      return (
                        <div
                          key={lec._id}
                          className={`border p-2 rounded bg-gray-50 ${!isUnlocked ? "opacity-50" : ""}`}
                        >
                          <h4 className="font-medium">{highlightText(lec.title, search)}</h4>

                          {isUnlocked ? (
                            <>
                              {lec.videoUrl && (
                                <div className="mt-1">
                                  <iframe
                                    width="100%"
                                    height="200"
                                    src={lec.videoUrl}
                                    title={lec.title}
                                    allowFullScreen
                                  ></iframe>
                                </div>
                              )}

                              {lec.pdfs.length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {lec.pdfs.map((pdf, idx) => (
                                    <a
                                      key={idx}
                                      href={pdf}
                                      target="_blank"
                                      className="text-blue-600 hover:underline block"
                                    >
                                      PDF {idx + 1}
                                    </a>
                                  ))}
                                </div>
                              )}

                              {!completedLectures.includes(lec._id) && (
                                <button
                                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                                  onClick={() => markLectureComplete(lec._id)}
                                >
                                  Mark as Complete
                                </button>
                              )}
                              {completedLectures.includes(lec._id) && (
                                <p className="mt-2 text-green-600 font-semibold">Completed ✅</p>
                              )}
                            </>
                          ) : (
                            <p className="text-gray-500">Locked 🔒</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Instructor Info */}
        <section>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Instructor Info</h2>
          <p>Instructor: John Doe</p>
          <p>Email: john@example.com</p>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Reviews</h2>
          <p>⭐⭐⭐⭐⭐ (5/5) – Great course!</p>
          <p>⭐⭐⭐⭐ (4/5) – Very helpful.</p>
        </section>
      </div>
    </UserGuard>
  );
}
