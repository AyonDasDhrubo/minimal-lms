export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as unknown as T;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return (await res.text()) as unknown as T;
}

export const api = {
  // Generic methods
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: any) =>
    request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      headers: body instanceof FormData ? {} : { "Content-Type": "application/json" },
    }),
  postJson: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  putJson: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),

  // Courses
  getCourses: () => api.get("/api/courses"),
  getCourse: (id: string) => api.get(`/api/courses/${id}`),
  createCourse: (body: { title: string; price: number; description: string; thumbnail: string }) =>
    api.postJson("/api/courses", body),
  updateCourse: (id: string, body: any) => {
    if (body instanceof FormData) {
      return fetch(`${API_BASE}/api/courses/${id}`, {
        method: "PUT",
        body,
      }).then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      });
    } else {
      return api.putJson(`/api/courses/${id}`, body);
    }
  },
  deleteCourse: (id: string) => api.delete(`/api/courses/${id}`),

  // Modules
  getModules: (courseId: string) => api.get(`/api/modules/course/${courseId}`),
  createModule: (payload: { courseId: string; title: string }) =>
    api.postJson("/api/modules", payload),
  updateModule: (id: string, body: { title: string }) =>
    api.putJson(`/api/modules/${id}`, body),
  deleteModule: (id: string) => api.delete(`/api/modules/${id}`),

  // Lectures
  getLecturesByModule: (moduleId: string) =>
    api.get(`/api/lectures/module/${moduleId}`),
  getAllLectures: () => api.get("/api/lectures"),
  createLecture: (formData: FormData) =>
    api.post("/api/lectures", formData),
  deleteLecture: (id: string) => api.delete(`/api/lectures/${id}`),

  // Auth
  login: (email: string, password: string) =>
    api.postJson("/api/auth/login", { email, password }),
};
