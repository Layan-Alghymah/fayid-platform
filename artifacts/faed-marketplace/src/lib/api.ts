export async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "خطأ في الاتصال" }));
    throw new Error(err.error || "حدث خطأ");
  }
  return res.json();
}
