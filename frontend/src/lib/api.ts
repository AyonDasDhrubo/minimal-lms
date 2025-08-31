// frontend/src/lib/api.ts

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(`/${path.replace(/^\/+/, "")}`, { // ensure no double slash
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(`/${path.replace(/^\/+/, "")}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    request<T>(`/${path.replace(/^\/+/, "")}`, { method: "DELETE" }),
};
