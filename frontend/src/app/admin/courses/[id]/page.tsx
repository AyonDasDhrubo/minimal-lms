import { Course } from "@/types/course";
import { API_BASE } from "@/lib/api";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
    const { id } = await params;
    const res = await fetch(`${API_BASE}/api/courses/${id}`, { cache: "no-store" });
    const course: Course = await res.json();

    return (
        <div className="p-6">
            <a href="/admin/courses" className="underline mb-4 inline-block">← Back</a>
            <div className="flex gap-6">
                <img src={course.thumbnail} alt={course.title} className="w-60 h-40 object-cover rounded" />
                <div>
                    <h1 className="text-2xl font-bold">{course.title}</h1>
                    <p className="text-gray-600">{course.description}</p>
                    <div className="mt-2 font-semibold">৳ {course.price}</div>
                </div>
            </div>
            <div className="mt-6 rounded border p-4">Module & Lecture management UI will go here (next step)</div>
        </div>
    );
}
