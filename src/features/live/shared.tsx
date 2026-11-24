"use client";
import { MotionConfig } from "motion/react";
import { Circle, Diamond, Square, Triangle, type LucideIcon } from "lucide-react";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { Background } from "@/features/arena/components/Background";
import { ToastProvider } from "@/features/arena/components/Toast";
import type { LiveView } from "@/lib/live/types";

/** Khung chung cho các trang lớp học trực tiếp (không có footer — màn hình chiếu cần trọn khung) */
export function LiveShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <div className="arena-root">
          <Background />
          {children}
        </div>
      </ToastProvider>
    </MotionConfig>
  );
}

/**
 * Màu + hình + chữ cho 4 đáp án. Màu đã kiểm tra phân biệt được (kể cả mù màu nhẹ) và
 * luôn đi kèm hình/chữ cái nên không phụ thuộc vào màu. Chữ trắng trên nền đạt AA.
 */
export const ANSWER_STYLES: { letter: string; color: string; soft: string; icon: LucideIcon; shape: string }[] = [
  { letter: "A", color: "#0369a1", soft: "#e0f2fe", icon: Triangle, shape: "tam giác" },
  { letter: "B", color: "#b45309", soft: "#fef3c7", icon: Diamond, shape: "kim cương" },
  { letter: "C", color: "#047857", soft: "#d1fae5", icon: Circle, shape: "tròn" },
  { letter: "D", color: "#a21caf", soft: "#fae8ff", icon: Square, shape: "vuông" },
];
export const answerStyle = (i: number) => ANSWER_STYLES[i % ANSWER_STYLES.length];

export function AnswerGlyph({ i, className = "size-6" }: { i: number; className?: string }) {
  const s = answerStyle(i);
  const Icon = s.icon;
  return <Icon aria-hidden className={className} fill="currentColor" strokeWidth={1.5} />;
}

/** Tham số trên URL (chỉ đọc ở trình duyệt; ở server trả null để HTML khớp khi hydrate) */
const subscribeUrl = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener("live:url", cb);
  return () => { window.removeEventListener("popstate", cb); window.removeEventListener("live:url", cb); };
};
export function useUrlParam(name: string) {
  return useSyncExternalStore(subscribeUrl, () => new URLSearchParams(location.search).get(name), () => null);
}
export function setUrlParam(name: string, value: string | null) {
  const u = new URL(location.href);
  if (value === null) u.searchParams.delete(name); else u.searchParams.set(name, value);
  history.replaceState(null, "", u);
  window.dispatchEvent(new Event("live:url"));
}

export type StreamStatus = "connecting" | "open" | "reconnecting" | "failed";

/** Nhận trạng thái phòng qua SSE; tự kết nối lại khi rớt mạng. */
export function useLiveStream<T extends LiveView>(url: string | null) {
  const [state, setState] = useState<{ url: string | null; view: T | null; status: StreamStatus; offset: number }>(
    { url: null, view: null, status: "connecting", offset: 0 },
  );
  useEffect(() => {
    if (!url) return;
    const es = new EventSource(url);
    es.onopen = () => setState((s) => ({ ...s, url, status: "open" }));
    es.onmessage = (e) => {
      const view = JSON.parse(e.data) as T;
      // lệch đồng hồ giữa máy này và server, để đếm ngược khớp với màn hình chiếu
      setState({ url, view, status: "open", offset: view.serverNow - Date.now() });
    };
    es.onerror = () => {
      // CLOSED = server trả lỗi (phòng không tồn tại / không có quyền) → không thử lại
      setState((s) => ({ ...s, url, status: es.readyState === EventSource.CLOSED ? "failed" : "reconnecting" }));
    };
    return () => es.close();
  }, [url]);
  // dữ liệu của URL cũ không dùng cho URL mới
  return state.url === url ? state : { url, view: null, status: "connecting" as StreamStatus, offset: 0 };
}

/** Số giây còn lại tới mốc deadline (đồng hồ server) */
export function useCountdown(deadline: number | null, offset: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (deadline === null) return;
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [deadline]);
  if (deadline === null) return { left: 0, ms: 0 };
  const ms = Math.max(0, deadline - (now + offset));
  return { left: Math.ceil(ms / 1000), ms };
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `Lỗi máy chủ (${res.status})`);
  return data as T;
}

/** Lưu trữ an toàn (trình duyệt chặn storage vẫn chạy được) */
export const store = {
  get<T>(s: "local" | "session", k: string): T | null {
    try { const v = (s === "local" ? localStorage : sessionStorage).getItem(k); return v ? (JSON.parse(v) as T) : null; } catch { return null; }
  },
  set(s: "local" | "session", k: string, v: unknown) {
    try { (s === "local" ? localStorage : sessionStorage).setItem(k, JSON.stringify(v)); } catch { /* bỏ qua */ }
  },
  del(s: "local" | "session", k: string) {
    try { (s === "local" ? localStorage : sessionStorage).removeItem(k); } catch { /* bỏ qua */ }
  },
};
