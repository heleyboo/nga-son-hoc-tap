import { SUBJECTS } from "../data/meta";
import type { AnswerRecord, RoundQuestion, RoundResult, Subject } from "../data/types";

export { scoreAnswer, ARENA_SECONDS, PRACTICE_POINTS } from "@/lib/scoring";

/* ---------------- Random ---------------- */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Đáp án dạng Đúng/Sai hoặc "Tất cả đều đúng" giữ nguyên thứ tự cho tự nhiên */
function keepOrder(options: string[]) {
  const joined = options.join("|").toLowerCase();
  return (options.length === 2 && /đúng|sai|true|false/.test(joined)) || /tất cả|cả a|cả hai|both|all of/.test(joined);
}

/** Xáo đáp án; `optionOrigin[i]` = chỉ số gốc của đáp án ở vị trí i (dùng khi gửi lên server) */
export function shuffleOptions(q: RoundQuestion): RoundQuestion {
  const base = q.optionOrigin.map((orig, i) => ({ orig, text: q.options[i] }));
  const order = keepOrder(q.options) ? base : shuffle(base);
  const answer = q.answer === undefined ? undefined : order.findIndex((o) => o.orig === q.optionOrigin[q.answer!]);
  return { ...q, options: order.map((o) => o.text), optionOrigin: order.map((o) => o.orig), answer };
}

/* ---------------- Danh hiệu ---------------- */
export interface Rank {
  key: "legend" | "gold" | "silver" | "bronze";
  title: string;
  message: string;
  tone: "gold" | "sky" | "emerald" | "slate";
}

/** Giữ 3 mức nhận xét của bản cũ (≥80%, ≥50%, <50%), tách mức 100% */
export function rankFor(pct: number): Rank {
  if (pct >= 100) return { key: "legend", title: "Huyền thoại đấu trường", message: "Tuyệt đối! Không sai một câu nào.", tone: "gold" };
  if (pct >= 80) return { key: "gold", title: "SIÊU NHÂN ĐÂY RỒI!", message: "Bạn đã làm rất xuất sắc!", tone: "gold" };
  if (pct >= 50) return { key: "silver", title: "Bạn làm rất tốt!", message: "Thêm một chút nữa là chạm mốc xuất sắc rồi.", tone: "sky" };
  return { key: "bronze", title: "Đừng nản lòng!", message: "Mỗi câu sai là một điều mới học được. Thử lại nhé!", tone: "emerald" };
}

/* ---------------- Phân tích theo môn ---------------- */
export interface SubjectStat {
  subject: Subject;
  correct: number;
  total: number;
  pct: number;
  verdict: "Xuất sắc" | "Tốt" | "Khá" | "Cần ôn thêm";
  topics: string[]; // chủ đề có câu sai
}

export function analyse(questions: RoundQuestion[], answers: AnswerRecord[]): SubjectStat[] {
  const map = new Map<Subject, SubjectStat>();
  questions.forEach((q, i) => {
    const a = answers[i];
    if (!a) return;
    const s = map.get(q.subject) ?? { subject: q.subject, correct: 0, total: 0, pct: 0, verdict: "Tốt", topics: [] };
    s.total++;
    if (a.correct) s.correct++;
    else if (q.topic && !s.topics.includes(q.topic)) s.topics.push(q.topic);
    map.set(q.subject, s);
  });
  return [...map.values()]
    .map((s) => {
      const pct = Math.round((s.correct / s.total) * 100);
      const verdict: SubjectStat["verdict"] = pct >= 90 ? "Xuất sắc" : pct >= 70 ? "Tốt" : pct >= 50 ? "Khá" : "Cần ôn thêm";
      return { ...s, pct, verdict };
    })
    .sort((a, b) => b.total - a.total);
}

export function suggestions(stats: SubjectStat[]): string[] {
  const weak = stats.filter((s) => s.pct < 70).sort((a, b) => a.pct - b.pct);
  if (weak.length === 0) {
    return ["Bạn đang nắm chắc kiến thức. Thử cấp độ Nâng cao hoặc chế độ Thi đấu để tăng thử thách!"];
  }
  return weak.slice(0, 3).map((s) => {
    const name = SUBJECTS[s.subject].short;
    const topics = s.topics.slice(0, 2).join(", ");
    return topics
      ? `${name}: ôn lại ${topics.toLowerCase()} (${s.correct}/${s.total} câu đúng).`
      : `${name}: xem lại các câu sai và luyện thêm (${s.correct}/${s.total} câu đúng).`;
  });
}

export function formatDuration(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} phút ${String(s % 60).padStart(2, "0")} giây` : `${s} giây`;
}
export function formatClock(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function summarize(r: Pick<RoundResult, "correct" | "total">) {
  return r.total ? Math.round((r.correct / r.total) * 100) : 0;
}
