/**
 * "Thử thách mỗi ngày": mỗi khối 5 câu/ngày (giờ Việt Nam), chung cho cả trường.
 * - Đề chốt (lưu daily_sets) khi có người mở lần đầu trong ngày → sửa kho câu hỏi giữa ngày không làm đổi đề.
 * - Server bấm giờ: câu i được tính giờ từ lúc client gọi "next" (shownAt) tới lúc gửi đáp án.
 * - Tài khoản đăng nhập: lượt đầu tiên trong ngày là lượt tính điểm (ranked), làm dở thì vào lại tiếp tục.
 *   Khách: chơi được, không lên bảng, chuỗi ngày lưu trên máy.
 */
import { randomBytes, timingSafeEqual } from "node:crypto";
import { and, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { dailyRuns, dailySets, questions, type DailyAnswer } from "@/db/schema";
import type { SessionUser } from "./auth";
import { ARENA_SECONDS, scoreAnswer } from "./scoring";

export const DAILY_COUNT = 5;
const TZ_OFFSET_MS = 7 * 3600 * 1000; // Asia/Ho_Chi_Minh, không có giờ mùa hè
const DAY = 86400 * 1000;

export const vnDate = (ms = Date.now()) => new Date(ms + TZ_OFFSET_MS).toISOString().slice(0, 10);
export const nextResetAt = (ms = Date.now()) => (Math.floor((ms + TZ_OFFSET_MS) / DAY) + 1) * DAY - TZ_OFFSET_MS;
const addDays = (date: string, n: number) => new Date(Date.parse(date + "T00:00:00Z") + n * DAY).toISOString().slice(0, 10);

export class DailyError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/* ---------- ngẫu nhiên có hạt giống: cả trường thấy cùng đề, cùng thứ tự đáp án ---------- */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle<T>(arr: T[], seed: string) {
  const r = rng(hash(seed)), a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/** thứ tự hiển thị đáp án: order[vị trí hiển thị] = chỉ số gốc */
const optionOrder = (date: string, qid: number, n: number) => seededShuffle([...Array(n).keys()], `${date}:${qid}:opt`);

/* ---------- đề của ngày ---------- */
function getSetIds(date: string, grade: number): number[] {
  const db = getDb();
  const found = db.select().from(dailySets).where(and(eq(dailySets.date, date), eq(dailySets.grade, grade))).get();
  if (found) return found.questionIds;
  const pool = db.select({ id: questions.id, level: questions.level, subject: questions.subject })
    .from(questions).where(and(eq(questions.isActive, true), eq(questions.grade, grade))).orderBy(questions.id).all();
  if (!pool.length) throw new DailyError(404, "Khối này chưa có câu hỏi");
  // 3 câu cơ bản + 2 nâng cao, ưu tiên các môn khác nhau
  const shuffled = seededShuffle(pool, `${date}:${grade}`);
  const picked: typeof pool = [];
  const want = { basic: 3, advanced: 2 };
  for (const pass of [0, 1, 2]) {
    for (const q of shuffled) {
      if (picked.length >= DAILY_COUNT) break;
      if (picked.includes(q)) continue;
      const levelOk = pass === 2 || picked.filter((p) => p.level === q.level).length < want[q.level];
      const subjectOk = pass >= 1 || !picked.some((p) => p.subject === q.subject);
      if (levelOk && subjectOk) picked.push(q);
    }
  }
  const ids = picked.map((q) => q.id);
  db.insert(dailySets).values({ date, grade, questionIds: ids }).onConflictDoNothing().run();
  return db.select().from(dailySets).where(and(eq(dailySets.date, date), eq(dailySets.grade, grade))).get()!.questionIds;
}

function loadQuestions(ids: number[]) {
  const rows = getDb().select({
    id: questions.id, subject: questions.subject, level: questions.level, content: questions.content, options: questions.options,
    answerIndex: questions.answerIndex, explanation: questions.explanation, explanationReviewed: questions.explanationReviewed,
  }).from(questions).where(inArray(questions.id, ids)).all();
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((q) => !!q);
}

type Run = typeof dailyRuns.$inferSelect;
type Q = ReturnType<typeof loadQuestions>[number];
const limitMs = (q: Q) => ARENA_SECONDS[q.level] * 1000;

/* ---------- góc nhìn gửi cho client ---------- */
function runView(run: Run, qs: Q[], includeToken: boolean) {
  const finished = run.finishedAt !== null;
  const q = finished ? null : qs[run.current];
  const order = q ? optionOrder(run.date, q.id, q.options.length) : null;
  return {
    runId: run.id,
    ...(includeToken ? { token: run.token } : {}),
    date: run.date, grade: run.grade, ranked: run.ranked, total: qs.length, current: run.current, finished,
    score: run.score, correct: run.correctCount, streak: run.streak,
    /** null = câu hiện tại chưa được mở (chờ bấm "Câu tiếp") */
    question: q && order ? {
      index: run.current, subject: q.subject, level: q.level, content: q.content,
      options: order.map((i) => q.options[i]), seconds: ARENA_SECONDS[q.level],
      deadline: run.shownAt ? run.shownAt + limitMs(q) : null,
    } : null,
    review: run.answers.map((a, i) => {
      const qq = qs[i];
      const ord = optionOrder(run.date, qq.id, qq.options.length);
      return {
        content: qq.content, options: ord.map((k) => qq.options[k]), subject: qq.subject,
        choice: a.choice, answerIndex: ord.indexOf(qq.answerIndex), correct: a.correct, points: a.points,
        explanation: qq.explanation, explanationReviewed: qq.explanationReviewed,
      };
    }),
    serverNow: Date.now(),
    resetAt: nextResetAt(),
  };
}

function findRun(id: number, token: string) {
  const run = getDb().select().from(dailyRuns).where(eq(dailyRuns.id, id)).get();
  if (!run) throw new DailyError(404, "Không tìm thấy lượt chơi");
  const a = Buffer.from(run.token), b = Buffer.from(token);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new DailyError(403, "Lượt chơi không hợp lệ");
  return run;
}

/* ---------- hành động ---------- */
/** Bắt đầu (hoặc tiếp tục) lượt hôm nay. Tài khoản đã có lượt tính điểm hôm nay → trả lại lượt đó. */
export function startRun(grade: number, me: SessionUser | null) {
  const db = getDb();
  const date = vnDate();
  if (me) {
    const existing = db.select().from(dailyRuns).where(and(eq(dailyRuns.userId, me.id), eq(dailyRuns.date, date), eq(dailyRuns.ranked, true))).get();
    if (existing) {
      const ids = getSetIds(existing.date, existing.grade);
      return { ...runView(existing, loadQuestions(ids), true), resumed: true };
    }
  }
  const ids = getSetIds(date, grade);
  const qs = loadQuestions(ids);
  const run = db.insert(dailyRuns).values({
    token: randomBytes(18).toString("base64url"), date, grade, userId: me?.id ?? null, ranked: !!me, shownAt: Date.now(),
  }).returning().get();
  return { ...runView(run, qs, true), resumed: false };
}

export function getRun(id: number, token: string) {
  const run = findRun(id, token);
  return runView(run, loadQuestions(getSetIds(run.date, run.grade)), false);
}

/** Mở câu tiếp theo — bắt đầu tính giờ. Gọi lại khi câu đã mở thì không có tác dụng (không “reset” được đồng hồ). */
export function nextQuestion(id: number, token: string) {
  const run = findRun(id, token);
  if (run.finishedAt === null && run.shownAt === 0) {
    getDb().update(dailyRuns).set({ shownAt: Date.now() }).where(and(eq(dailyRuns.id, id), eq(dailyRuns.shownAt, 0))).run();
  }
  return getRun(id, token);
}

export function answerQuestion(id: number, token: string, index: number, choice: number | null) {
  const db = getDb();
  const run = findRun(id, token);
  if (run.finishedAt !== null) throw new DailyError(409, "Lượt chơi đã kết thúc");
  if (index !== run.current) throw new DailyError(409, "Câu này đã được trả lời");
  if (run.shownAt === 0) throw new DailyError(409, "Câu hỏi chưa được mở");
  const qs = loadQuestions(getSetIds(run.date, run.grade));
  const q = qs[run.current];
  const order = optionOrder(run.date, q.id, q.options.length);
  const now = Date.now();
  const timeMs = now - run.shownAt;
  // quá giờ (cho phép trễ mạng 1 giây) → tính như không trả lời
  const valid = choice !== null && timeMs <= limitMs(q) + 1000 && choice >= 0 && choice < order.length;
  const correct = valid && order[choice!] === q.answerIndex;
  const s = scoreAnswer({ correct, mode: "arena", level: q.level, timeMs, comboBefore: run.streak });
  const answers: DailyAnswer[] = [...run.answers, { questionId: q.id, choice: valid ? choice : null, correct, timeMs, points: s.points }];
  const done = answers.length >= qs.length;
  db.update(dailyRuns).set({
    answers, current: run.current + 1, shownAt: 0, streak: s.combo,
    score: run.score + s.points, correctCount: run.correctCount + (correct ? 1 : 0), finishedAt: done ? now : null,
  }).where(and(eq(dailyRuns.id, id), eq(dailyRuns.current, run.current))).run();
  return getRun(id, token);
}

/* ---------- bảng xếp hạng ngày ---------- */
export function dailyBoard(grade: number, date: string, meId: string | null, limit = 20) {
  const rows = getDb().all<{ user_id: string; score: number; correct_count: number; total_ms: number; nickname: string | null; name: string; class_name: string | null }>(sql`
    SELECT r.user_id, r.score, r.correct_count,
           (SELECT COALESCE(SUM(json_extract(j.value, '$.timeMs')), 0) FROM json_each(r.answers) j) AS total_ms,
           u.nickname, u.name, u.class_name
    FROM daily_runs r JOIN "user" u ON u.id = r.user_id
    WHERE r.ranked = 1 AND r.finished_at IS NOT NULL AND r.date = ${date} AND r.grade = ${grade}
    ORDER BY r.score DESC, r.correct_count DESC, total_ms ASC`);
  let rank = 0, prev: (typeof rows)[number] | null = null;
  const all = rows.map((r, i) => {
    if (!prev || prev.score !== r.score || prev.correct_count !== r.correct_count) rank = i + 1;
    prev = r;
    return { rank, name: r.nickname || r.name.split(" ").slice(-1)[0], className: r.class_name, score: r.score, correct: r.correct_count, isMe: r.user_id === meId };
  });
  const me = all.find((r) => r.isMe) ?? null;
  return { date, grade, total: all.length, items: all.slice(0, limit), me };
}

/* ---------- chuỗi ngày của tài khoản ---------- */
export function myDaily(userId: string) {
  const db = getDb();
  const since = addDays(vnDate(), -120);
  const days = db.select({ date: dailyRuns.date, score: dailyRuns.score, correct: dailyRuns.correctCount, grade: dailyRuns.grade })
    .from(dailyRuns)
    .where(and(eq(dailyRuns.userId, userId), eq(dailyRuns.ranked, true), isNotNull(dailyRuns.finishedAt), sql`${dailyRuns.date} >= ${since}`))
    .orderBy(dailyRuns.date).all();
  return { days, ...streaks(days.map((d) => d.date)) };
}

/** Chuỗi hiện tại (tính tới hôm nay, hoặc hôm qua nếu hôm nay chưa chơi) và chuỗi dài nhất */
export function streaks(dates: string[]) {
  const set = new Set(dates);
  const today = vnDate();
  let cur = 0;
  let d = set.has(today) ? today : addDays(today, -1);
  while (set.has(d)) { cur++; d = addDays(d, -1); }
  let best = 0, run = 0, last: string | null = null;
  for (const x of [...set].sort()) {
    run = last && addDays(last, 1) === x ? run + 1 : 1;
    best = Math.max(best, run);
    last = x;
  }
  return { current: cur, best, playedToday: set.has(today) };
}

/** Lớp kiểu "8A" → khối 8 (để chọn sẵn khối cho học sinh) */
export function gradeFromClass(cls: string | null | undefined) {
  const g = Number(cls?.trim().match(/^[6-9]/)?.[0]);
  return g >= 6 && g <= 9 ? g : null;
}
