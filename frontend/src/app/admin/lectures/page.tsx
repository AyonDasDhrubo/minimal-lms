"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Lecture, Module, Course } from "@/types/lecture";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LectureListPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");

  // Fetch courses & lectures
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await api.getCourses();
        setCourses(coursesData || []);

        const lecturesData = await api.getAllLectures();
        setLectures(lecturesData || []);
        setFilteredLectures(lecturesData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch modules when course changes
  useEffect(() => {
    const fetchModules = async () => {
      if (!selectedCourse) {
        setModules([]);
        setSelectedModule("");
        return;
      }
      try {
        const allModules = await api.getModules(selectedCourse);
        setModules(allModules || []);
        setSelectedModule("");
      } catch (err) {
        console.error("Error fetching modules:", err);
      }
    };
    fetchModules();
  }, [selectedCourse]);

  // Apply filters safely
  useEffect(() => {
    let filtered = lectures.filter(Boolean); // remove null/undefined
    if (selectedCourse) {
      filtered = filtered.filter(
        (l) => l?.module?.courseId?._id === selectedCourse
      );
    }
    if (selectedModule) {
      filtered = filtered.filter((l) => l?.module?._id === selectedModule);
    }
    setFilteredLectures(filtered);
  }, [selectedCourse, selectedModule, lectures]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Lectures</h1>

      <div className="flex gap-4 mb-4">
        <Select onValueChange={setSelectedCourse} value={selectedCourse}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedModule} value={selectedModule}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((m) => (
              <SelectItem key={m._id} value={m._id}>
                {m.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>PDFs</TableHead>
            <TableHead>Video URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLectures.map((l) => (
            l ? (
              <TableRow key={l._id}>
                <TableCell>{l.title}</TableCell>
                <TableCell>{l.module?.courseId?.title || "N/A"}</TableCell>
                <TableCell>{l.module?.title || "N/A"}</TableCell>
                <TableCell>
                  {l.pdfs?.length > 0
                    ? l.pdfs.map((pdf) => (
                        <a
                          key={pdf}
                          href={pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline block"
                        >
                          {pdf.split("/").pop()}
                        </a>
                      ))
                    : "No PDFs"}
                </TableCell>
                <TableCell>
                  {l.videoUrl ? (
                    <a
                      href={l.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Watch Video
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ) : null
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
