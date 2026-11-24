/**
 * Tiến trình chung: Điểm Tri Thức (XP), cấp độ, chuỗi ngày học, huy hiệu trò chơi.
 * File THUẦN (không đụng DB/trình duyệt) — dùng chung cho máy chủ (tài khoản Google)
 * và trình duyệt (khách, lưu trên máy) để hai bên tính giống hệt nhau.
 */
import type { GameSlug } from "./modules";

/* ======================= Cấp độ ======================= */
export const RANKS = [
  { min: 0, name: "Mầm non tri thức" },
  { min: 100, name: "Chồi non chăm chỉ" },
  { min: 250, name: "Học trò siêng năng" },
  { min: 450, name: "Nhà thám hiểm nhỏ" },
  { min: 700, name: "Chiến binh tri thức" },
  { min: 1000, name: "Ngôi sao lớp học" },
  { min: 1400, name: "Nhà khoa học trẻ" },
  { min: 1900, name: "Bậc thầy giải đố" },
  { min: 2500, name: "Hiệp sĩ trí tuệ" },
  { min: 3200, name: "Nhà thông thái Nga Sơn" },
] as const;

export function levelOf(xp: number) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].min) i++;
  const next = RANKS[i + 1];
  return {
    level: i + 1, name: RANKS[i].name, from: RANKS[i].min, to: next?.min ?? null,
    /** tiến độ trong cấp hiện tại 0..1 (cấp cao nhất = 1) */
    progress: next ? (xp - RANKS[i].min) / (next.min - RANKS[i].min) : 1,
  };
}

/* ======================= XP theo hoạt động ======================= */
export const xpArena = (a: { mode: string; correct: number; isRetry: boolean }) =>
  a.isRetry ? a.correct : a.mode === "arena" ? 10 + 3 * a.correct : 5 + 2 * a.correct;
export const xpDaily = (correct: number) => 20 + 4 * correct;
export const xpAssignment = (correct: number) => 10 + 2 * correct;

/** Mỗi trò chơi chỉ tính XP cho tối đa từng này lượt/ngày (học là chính, chơi để thư giãn) */
export const GAME_XP_PLAYS_PER_DAY = 3;

/* ======================= Kết quả trò chơi ======================= */
export type GameResult = {
  game: GameSlug;
  score: number | null;
  correct: number | null;
  total: number | null;
  answered: number | null;
  level: number | null;
  victory: boolean;
  durationSec: number | null;
};
export type GamePlay = GameResult & { xp: number; at: number /* ms */ };

type Rule = {
  kind: "score" | "level";
  /** số câu hợp lệ của từng chế độ (game có điểm) hoặc số màn (game giải đố) */
  modes: number[];
  check: (r: GameResult) => string | null;
  xp: (r: GameResult) => number;
};
const intIn = (v: number | null, lo: number, hi: number) => v !== null && Number.isInteger(v) && v >= lo && v <= hi;

/**
 * Luật từng trò chơi. Điểm nằm ở trình duyệt nên KHÔNG chống được gian lận tuyệt đối;
 * ở đây chặn những kết quả vô lý (vượt điểm tối đa, xong quá nhanh) để bảng kỷ lục đáng tin hơn.
 */
export const GAME_RULES: Record<GameSlug, Rule> = {
  // bắn trúng đúng: 10 × combo (tối đa ×5) → ≤ 50 điểm/câu; phải bắn trúng mới qua câu nên đúng = tổng
  "chien-co": {
    kind: "score", modes: [10, 30],
    check: (r) => !intIn(r.total, 1, 30) || ![10, 30].includes(r.total!) ? "Số câu không hợp lệ"
      : r.correct !== r.total ? "Số câu đúng không hợp lệ"
        : !intIn(r.score, 0, r.total! * 50) ? "Điểm vượt mức tối đa"
          : r.durationSec === null || r.durationSec < r.total! * 2 ? "Thời gian chơi quá ngắn" : null,
    xp: (r) => 10 + 2 * (r.correct ?? 0),
  },
  // mỗi trạm trả lời 1 lần: đúng +25, sai +5 → điểm xác định hoàn toàn từ số câu đúng
  "quy-dao": {
    kind: "score", modes: [4, 8],
    check: (r) => !intIn(r.total, 1, 8) || ![4, 8].includes(r.total!) ? "Số trạm không hợp lệ"
      : !intIn(r.correct, 0, r.total!) ? "Số câu đúng không hợp lệ"
        : r.score !== r.correct! * 25 + (r.total! - r.correct!) * 5 ? "Điểm không khớp số câu đúng"
          : r.durationSec === null || r.durationSec < r.total! * 3 ? "Thời gian chơi quá ngắn" : null,
    xp: (r) => 5 + 4 * (r.correct ?? 0),
  },
  // câu hỏi ngọc trai +30, nhặt rác cộng điểm theo combo; có thể thắng sớm khi biển sạch 100%
  "tau-ngam": {
    kind: "score", modes: [5, 10],
    check: (r) => !intIn(r.total, 1, 10) || ![5, 10].includes(r.total!) ? "Số câu không hợp lệ"
      : !intIn(r.answered, 0, r.total!) || !intIn(r.correct, 0, r.answered ?? 0) ? "Số câu đúng không hợp lệ"
        : !intIn(r.score, 0, 6000) ? "Điểm vượt mức tối đa"
          : r.durationSec === null || r.durationSec < 10 ? "Thời gian chơi quá ngắn" : null,
    xp: (r) => 5 + 3 * (r.correct ?? 0) + (r.victory ? 10 : 0),
  },
  "duong-sang-lang-coi": {
    kind: "level", modes: [1, 2],
    check: (r) => (intIn(r.level, 1, 2) ? null : "Màn không hợp lệ"),
    xp: () => 20,
  },
  "lang-coi-mo-hoi": {
    kind: "level", modes: [1, 2, 3],
    check: (r) => (intIn(r.level, 1, 3) ? null : "Màn không hợp lệ"),
    xp: () => 20,
  },
};

/** Chuẩn hoá dữ liệu thô từ game (postMessage) — trả null nếu không phải kết quả hợp lệ */
export function normalizeResult(raw: unknown): GameResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.game !== "string" || !(o.game in GAME_RULES)) return null;
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);
  return {
    game: o.game as GameSlug, score: num(o.score), correct: num(o.correct), total: num(o.total),
    answered: num(o.answered) ?? num(o.total), level: num(o.level), victory: o.victory === true, durationSec: num(o.durationSec),
  };
}

/** Ngày theo giờ Việt Nam, dạng YYYY-MM-DD */
export const vnDay = (ms: number) => new Date(ms + 7 * 3600_000).toISOString().slice(0, 10);

/** XP cho một lượt chơi mới, áp giới hạn số lượt được tính trong ngày */
export function gameXp(r: GameResult, earlierToday: number) {
  return earlierToday >= GAME_XP_PLAYS_PER_DAY ? 0 : GAME_RULES[r.game].xp(r);
}

/* ======================= Chuỗi ngày học ======================= */
export function dayStreak(days: Iterable<string>, now = Date.now()) {
  const set = new Set(days);
  const sorted = [...set].sort();
  let best = 0, run = 0, prev: number | null = null;
  for (const d of sorted) {
    const t = Date.parse(d);
    run = prev !== null && t - prev === 86_400_000 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  // chuỗi hiện tại: tính lùi từ hôm nay (hoặc hôm qua nếu hôm nay chưa học)
  let cur = 0;
  let t = Date.parse(vnDay(now));
  if (!set.has(vnDay(now))) t -= 86_400_000;
  while (set.has(new Date(t).toISOString().slice(0, 10))) { cur++; t -= 86_400_000; }
  return { current: cur, best, today: set.has(vnDay(now)), activeDays: set.size };
}

/* ======================= Huy hiệu trò chơi ======================= */
export type GameBadge = { id: string; name: string; desc: string; color: string; emoji: string; test: (plays: GamePlay[]) => boolean };
const by = (plays: GamePlay[], g: GameSlug) => plays.filter((p) => p.game === g);
export const GAME_BADGES: GameBadge[] = [
  { id: "g-pilot", name: "Phi công át chủ bài", desc: "Hoàn thành Chiến Cơ Kiến Thức chế độ 30 câu", color: "#4f46e5", emoji: "🚀", test: (p) => by(p, "chien-co").some((x) => x.total === 30) },
  { id: "g-earth", name: "Người giữ Trái Đất", desc: "Quỹ Đạo Xanh 8 kỳ quan, đúng tất cả", color: "#059669", emoji: "🌍", test: (p) => by(p, "quy-dao").some((x) => x.total === 8 && x.correct === 8) },
  { id: "g-ocean", name: "Nhà thám hiểm đại dương", desc: "Làm sạch đại dương trong Tàu Ngầm Xanh", color: "#0284c7", emoji: "🌊", test: (p) => by(p, "tau-ngam").some((x) => x.victory) },
  { id: "g-light", name: "Người thắp đèn hiệu", desc: "Hoàn thành cả 2 màn Đường Sáng Làng Cói", color: "#d97706", emoji: "💡", test: (p) => by(p, "duong-sang-lang-coi").some((x) => x.level === 2) },
  { id: "g-market", name: "Tài năng làng cói", desc: "Vượt cả 3 thử thách Làng Cói mở hội", color: "#b45309", emoji: "🧺", test: (p) => by(p, "lang-coi-mo-hoi").some((x) => x.level === 3) },
  { id: "g-all", name: "Nhà thám hiểm STEM", desc: "Chơi đủ cả 5 trò chơi STEM", color: "#7c3aed", emoji: "🧭", test: (p) => new Set(p.map((x) => x.game)).size >= 5 },
];
export const earnedGameBadges = (plays: GamePlay[]) => GAME_BADGES.filter((b) => b.test(plays)).map((b) => b.id);

/* ======================= Tổng hợp ======================= */
export type ProgressInput = {
  arena: { mode: string; correct: number; isRetry: boolean; at: number }[];
  daily: { correct: number; at: number }[];
  assignments: { correct: number; at: number }[];
  games: GamePlay[];
};
export type GameStat = { plays: number; best: number | null; bestCorrect: string | null; levels: number[]; victories: number };

export function summarize(input: ProgressInput, now = Date.now()) {
  const breakdown = {
    arena: input.arena.reduce((s, a) => s + xpArena(a), 0),
    daily: input.daily.reduce((s, d) => s + xpDaily(d.correct), 0),
    assignments: input.assignments.reduce((s, a) => s + xpAssignment(a.correct), 0),
    games: input.games.reduce((s, g) => s + g.xp, 0),
  };
  const xp = breakdown.arena + breakdown.daily + breakdown.assignments + breakdown.games;
  const days = [...input.arena, ...input.daily, ...input.assignments, ...input.games].map((x) => vnDay(x.at));
  const games: Partial<Record<GameSlug, GameStat>> = {};
  for (const p of input.games) {
    const s = (games[p.game] ??= { plays: 0, best: null, bestCorrect: null, levels: [], victories: 0 });
    s.plays++;
    if (p.victory) s.victories++;
    if (p.score !== null && (s.best === null || p.score > s.best)) { s.best = p.score; s.bestCorrect = p.total ? `${p.correct ?? 0}/${p.total}` : null; }
    if (p.level !== null && !s.levels.includes(p.level)) s.levels.push(p.level);
  }
  return {
    xp, breakdown, rank: levelOf(xp), streak: dayStreak(days, now), games,
    gameBadges: earnedGameBadges(input.games),
    counts: { arena: input.arena.length, daily: input.daily.length, assignments: input.assignments.length, games: input.games.length },
  };
}
export type ProgressSummary = ReturnType<typeof summarize>;
