/** Gọi API của server từ client. Mọi hàm ném Error với thông điệp tiếng Việt khi thất bại. */
import type { Catalog, GameConfig, Grade, HistoryEntry, Level, Me, Mode, RoundQuestion, Subject } from "../data/types";
import { shuffleOptions } from "../game/engine";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Lỗi máy chủ (${res.status})`;
    try { const b = await res.json(); if (b?.error) msg = b.error; } catch { /* bỏ qua */ }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}
const post = (url: string, body: unknown, method = "POST") =>
  fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

/* ---------- Phiên đăng nhập ---------- */
export async function fetchMe(): Promise<{ user: Me | null; googleEnabled: boolean }> {
  return json(await fetch("/api/me", { cache: "no-store" }));
}
export async function updateMe(data: { nickname: string; className?: string }): Promise<{ user: Me | null }> {
  return json(await post("/api/me", data, "PATCH"));
}

/* ---------- Kho câu hỏi ---------- */
export async function fetchCatalog(): Promise<Catalog> {
  const { items } = await json<{ items: { grade: Grade; level: Level; subject: Subject; total: number }[] }>(await fetch("/api/subjects"));
  const c: Catalog = {};
  for (const r of items) ((c[r.grade] ??= {})[r.level] ??= {})[r.subject] = r.total;
  return c;
}

interface PublicQuestion { id: number; code: string; subject: Subject; topic: string | null; content: string; options: string[] }

/** Đề ngẫu nhiên từ server (không kèm đáp án). Thứ tự đáp án được xáo ở client. */
export async function fetchRound(config: GameConfig): Promise<RoundQuestion[]> {
  const qs = new URLSearchParams({ grade: String(config.grade), level: config.level, count: String(config.count) });
  if (config.subjects.length) qs.set("subjects", config.subjects.join(","));
  const { items } = await json<{ items: PublicQuestion[] }>(await fetch(`/api/quiz?${qs}`, { cache: "no-store" }));
  return items.map((p) =>
    shuffleOptions({
      id: String(p.id), dbId: p.id, code: p.code, grade: config.grade, level: config.level,
      subject: p.subject, topic: p.topic, q: p.content, options: p.options, optionOrigin: p.options.map((_, i) => i),
    }),
  );
}

/**
 * Gửi lại khi yêu cầu rớt giữa đường (fetch ném lỗi, chưa có phản hồi) hoặc treo quá lâu.
 * Hay gặp trên điện thoại: trình duyệt dùng lại kết nối cũ đã bị Wi-Fi/4G/VPN cắt ngầm
 * trong lúc học sinh suy nghĩ → lần đầu hỏng, lần sau mở kết nối mới là được.
 * Chỉ dùng cho yêu cầu gửi lại vô hại (chấm câu chỉ đọc, không ghi gì).
 */
async function fetchRetry(url: string, init: RequestInit, tries = 3, waitMs = 4000): Promise<Response> {
  for (let i = 1; ; i++) {
    const ctl = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      // Hạn chót "cứng": kể cả khi trình duyệt không chịu huỷ fetch (gặp trên iOS), vẫn thôi chờ đúng hạn
      return await Promise.race([
        fetch(url, { ...init, cache: "no-store", signal: ctl.signal }),
        new Promise<never>((_, rej) => { timer = setTimeout(() => { ctl.abort(); rej(new Error("timeout")); }, waitMs); }),
      ]);
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 250 * i));
    } finally {
      clearTimeout(timer);
    }
  }
}

/**
 * Giữ kết nối tới máy chủ luôn "nóng" trong lúc làm bài: cứ ~15 giây gửi một yêu cầu rất nhỏ,
 * để Wi-Fi/4G/VPN không coi kết nối là bỏ không và cắt ngầm khi học sinh đang suy nghĩ.
 * Trả về hàm dừng.
 */
export function keepConnectionWarm(everyMs = 15000) {
  const ping = () => { if (document.visibilityState === "visible") fetch("/api/health", { cache: "no-store" }).catch(() => {}); };
  const id = setInterval(ping, everyMs);
  document.addEventListener("visibilitychange", ping); // quay lại tab/mở khoá máy → mở sẵn kết nối mới
  return () => { clearInterval(id); document.removeEventListener("visibilitychange", ping); };
}

/** Chấm 1 câu. `selected` là chỉ số đã xáo; trả về chỉ số đã xáo của đáp án đúng. */
export async function checkAnswer(q: RoundQuestion, selected: number | null) {
  const original = selected === null ? null : q.optionOrigin[selected];
  const r = await json<{ correct: boolean; answerIndex: number; explanation: string | null; explanationReviewed: boolean }>(
    await fetchRetry(`/api/questions/${q.dbId}/check`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ selectedIndex: original }),
    }),
  );
  return {
    correct: r.correct,
    answer: q.optionOrigin.indexOf(r.answerIndex),
    explain: r.explanation,
    explainStatus: (r.explanation ? (r.explanationReviewed ? "verified" : "draft") : "none") as RoundQuestion["explainStatus"],
  };
}

/* ---------- Nộp bài ---------- */
export interface SubmitResponse {
  attemptId: number;
  score: number;
  maxStreak: number;
  correctCount: number;
  total: number;
  rank: { position: number; total: number; period: "week" } | null;
}
export async function submitAttempt(input: {
  playerName: string; className?: string; grade: Grade; level: Level; mode: Mode; durationSec: number; isRetry: boolean;
  answers: { questionId: number; selectedIndex: number | null; timeMs: number }[];
}): Promise<SubmitResponse> {
  return json(await post("/api/attempts", input));
}

/* ---------- Lịch sử (tài khoản) ---------- */
export async function fetchMyHistory(): Promise<HistoryEntry[]> {
  const { items } = await json<{ items: { id: number; createdAt: string | number; grade: Grade; level: Level; mode: Mode; correct: number; total: number; score: number; maxStreak: number; durationSec: number; isRetry: boolean }[] }>(
    await fetch("/api/me/history", { cache: "no-store" }),
  );
  return items.map((h) => ({
    id: String(h.id), date: new Date(h.createdAt).getTime(), grade: h.grade, level: h.level, mode: h.mode,
    correct: h.correct, total: h.total, score: h.score, maxStreak: h.maxStreak, durationMs: h.durationSec * 1000, isRetry: h.isRetry,
  }));
}

/* ---------- Góp ý & báo lỗi ---------- */
export async function sendFeedback(input: {
  playerName?: string; grade?: Grade; level?: Level; attemptId?: number;
  rating: number; difficulty?: "easy" | "medium" | "hard"; tags: string[]; comment?: string;
}) {
  return json<{ id: number }>(await post("/api/feedback", input));
}
export async function fetchFeedbackSummary() {
  return json<{ total: number; avgRating: number | null; recent: { playerName: string | null; rating: number; tags: string[]; comment: string | null; createdAt: string }[] }>(
    await fetch("/api/feedback?limit=5", { cache: "no-store" }),
  );
}
export type ReportReason = "wrong_answer" | "unclear" | "typo" | "other";
export async function sendReport(q: RoundQuestion, reason: ReportReason, note?: string) {
  return json<{ id: number }>(await post(`/api/questions/${q.dbId}/report`, { reason, note: note || undefined }));
}

/* ---------- Bảng xếp hạng ---------- */
export interface BoardEntry {
  rank: number; isMe: boolean; name: string; className: string | null; grade: Grade; level: Level;
  score: number; correctCount: number; totalQuestions: number; durationSec: number; maxStreak: number; plays: number; createdAt: number;
}
export interface BoardQuery { grade: Grade | "all"; level: Level | "all"; mode: Mode; period: "week" | "month" | "all" }
export async function fetchLeaderboard(q: BoardQuery): Promise<{ total: number; items: BoardEntry[]; me: (BoardEntry & { of: number }) | null }> {
  const qs = new URLSearchParams({ grade: String(q.grade), level: q.level, mode: q.mode, period: q.period, limit: "50" });
  return json(await fetch(`/api/leaderboard?${qs}`, { cache: "no-store" }));
}
