import { Course } from "./course";

export type Module = {
  _id: string;
  title: string;
  number: number;
  courseId: Course;
};

export type Lecture = {
  _id: string;
  title: string;
  videoUrl: string;
  pdfs: string[];
  module: Module;
};
