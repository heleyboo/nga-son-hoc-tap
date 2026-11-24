/** Gọi API giáo viên. Ném Error với thông điệp tiếng Việt khi thất bại. */
export async function api<T>(url: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? (init?.body !== undefined ? "POST" : "GET"),
    headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // lỗi kiểm tra dữ liệu của zod: lấy thông điệp đầu tiên cho dễ hiểu
    const first = findMessage(data?.details);
    throw new Error(first ? `${data.error}: ${first}` : data?.error ?? `Lỗi máy chủ (${res.status})`);
  }
  return data as T;
}

function findMessage(d: unknown): string | null {
  if (!d || typeof d !== "object") return null;
  const o = d as { errors?: string[]; properties?: Record<string, unknown>; items?: unknown[] };
  if (o.errors?.length) return o.errors[0];
  for (const v of Object.values(o.properties ?? {})) { const m = findMessage(v); if (m) return m; }
  for (const v of o.items ?? []) { const m = findMessage(v); if (m) return m; }
  return null;
}

export const fmtDate = (sec: number | string | Date | null | undefined) => {
  if (sec === null || sec === undefined) return "—";
  const d = sec instanceof Date ? sec : new Date(typeof sec === "number" && sec < 1e12 ? sec * 1000 : sec);
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export function downloadText(name: string, text: string, type = "text/csv;charset=utf-8") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export const csvEsc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
