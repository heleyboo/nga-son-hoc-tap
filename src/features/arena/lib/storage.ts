/**
 * Lưu trữ trên trình duyệt — dùng cho KHÁCH (chưa đăng nhập Google).
 * Người đã đăng nhập dùng lịch sử trên server (/api/me/history).
 * Mọi lệnh đọc/ghi bọc try/catch vì localStorage có thể bị chặn.
 */
import type { HistoryEntry, RoundResult } from "../data/types";

const NS = "dttt.v1.";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; } catch { return false; }
}

export interface Profile { name: string; className: string }
export const loadProfile = () => read<Profile>("profile", { name: "", className: "" });
export const saveProfile = (p: Profile) => write("profile", p);

export const loadHistory = () => read<HistoryEntry[]>("history", []);
export function pushHistory(r: RoundResult) {
  const e: HistoryEntry = {
    id: r.id, date: r.date, grade: r.config.grade, level: r.config.level, mode: r.config.mode,
    correct: r.correct, total: r.total, score: r.score, maxStreak: r.maxStreak, durationMs: r.durationMs, isRetry: r.isRetry,
  };
  write("history", [e, ...loadHistory()].slice(0, 60));
  return e;
}
export const clearHistory = () => write("history", []);

export function storageAvailable() {
  try { localStorage.setItem(NS + "probe", "1"); localStorage.removeItem(NS + "probe"); return true; } catch { return false; }
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** Điểm cao theo khối × cấp độ × chế độ, tính từ lịch sử */
export interface Best { correct: number; total: number; score: number; pct: number; date: number }
export function bestsFrom(history: HistoryEntry[]): Record<string, Best> {
  const out: Record<string, Best> = {};
  for (const h of history) {
    if (h.isRetry || !h.total) continue;
    const k = `${h.grade}-${h.level}-${h.mode}`;
    const pct = Math.round((h.correct / h.total) * 100);
    const prev = out[k];
    if (!prev || pct > prev.pct || (pct === prev.pct && h.score > prev.score)) out[k] = { correct: h.correct, total: h.total, score: h.score, pct, date: h.date };
  }
  return out;
}
