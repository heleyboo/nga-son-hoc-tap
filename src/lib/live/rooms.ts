/**
 * Phòng "Lớp học trực tiếp" — giữ trong bộ nhớ của tiến trình Node (1 container).
 * Server là nguồn sự thật duy nhất: tự bấm giờ, tự chấm, tự xếp hạng; client chỉ nhận view qua SSE.
 * Khởi động lại server thì các phòng đang mở sẽ mất (chấp nhận được cho một buổi học).
 */
import { randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { and, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { liveSessions, questions } from "@/db/schema";
import { scoreAnswer } from "@/lib/scoring";
import {
  LIVE_LIMITS,
  type HostAction,
  type HostView,
  type LiveConfig,
  type LiveRankRow,
  type LiveView,
  type PlayerView,
} from "./types";

interface Answer { choice: number; timeMs: number; correct: boolean; points: number }
interface Player {
  id: string;
  token: string;
  name: string;
  className: string | null;
  joinedAt: number;
  score: number;
  correct: number;
  streak: number;
  gained: number;
  rank: number;
  prevRank: number | null;
  answers: Map<number, Answer>;
  streams: number;
  kicked: boolean;
}
interface Question {
  subject: string;
  content: string;
  options: string[];
  answerIndex: number;
  explanation: string | null;
  explanationReviewed: boolean;
}
type Listener = { kind: "host"; send: (v: LiveView) => void } | { kind: "player"; playerId: string; send: (v: LiveView) => void };

interface Room {
  code: string;
  hostUserId: string | null;
  firstStartedAt: number;
  hostKey: string;
  config: LiveConfig;
  questions: Question[];
  phase: HostView["phase"];
  qIndex: number;
  startedAt: number;
  deadline: number | null;
  players: Map<string, Player>;
  listeners: Set<Listener>;
  lastActivity: number;
  timer: ReturnType<typeof setTimeout> | null;
  notifyTimer: ReturnType<typeof setTimeout> | null;
  closed: boolean;
}

export class LiveError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/* ---------- kho phòng (sống qua hot-reload ở chế độ dev) ---------- */
const g = globalThis as unknown as { __liveRooms?: Map<string, Room>; __liveSweep?: ReturnType<typeof setInterval> };
const rooms = (g.__liveRooms ??= new Map<string, Room>());
if (!g.__liveSweep) {
  g.__liveSweep = setInterval(() => {
    const now = Date.now();
    for (const r of rooms.values()) if (now - r.lastActivity > LIVE_LIMITS.idleMs) closeRoom(r);
  }, 10 * 60 * 1000);
  g.__liveSweep.unref?.();
}

const token = () => randomBytes(18).toString("base64url");
const safeEq = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};
function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) { const j = randomInt(i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}

/* ---------- tạo / tìm phòng ---------- */
export function createRoom(config: LiveConfig, hostUserId: string | null = null) {
  if (rooms.size >= LIVE_LIMITS.maxRooms) throw new LiveError(503, "Máy chủ đang mở quá nhiều phòng, vui lòng thử lại sau");
  const db = getDb();
  const rows = db
    .select({
      subject: questions.subject, content: questions.content, options: questions.options,
      answerIndex: questions.answerIndex, explanation: questions.explanation, explanationReviewed: questions.explanationReviewed,
    })
    .from(questions)
    .where(and(
      eq(questions.isActive, true), eq(questions.grade, config.grade), eq(questions.level, config.level),
      config.subjects.length ? inArray(questions.subject, config.subjects) : undefined,
    ))
    .orderBy(sql`random()`)
    .limit(config.count)
    .all();
  if (!rows.length) throw new LiveError(400, "Không có câu hỏi phù hợp với khối/cấp độ/môn đã chọn");

  // Xáo thứ tự đáp án một lần cho cả phòng (mọi học sinh thấy cùng thứ tự với màn hình chiếu)
  const qs: Question[] = rows.map((r) => {
    const order = shuffle(r.options.map((_, i) => i));
    return { ...r, options: order.map((i) => r.options[i]), answerIndex: order.indexOf(r.answerIndex) };
  });

  let code = "";
  do code = String(randomInt(100000, 1000000)); while (rooms.has(code));
  const room: Room = {
    code, hostUserId, firstStartedAt: 0, hostKey: token(), config: { ...config, count: qs.length }, questions: qs,
    phase: "lobby", qIndex: -1, startedAt: 0, deadline: null,
    players: new Map(), listeners: new Set(), lastActivity: Date.now(),
    timer: null, notifyTimer: null, closed: false,
  };
  rooms.set(code, room);
  return { code, hostKey: room.hostKey, total: qs.length };
}

function getRoom(code: string) {
  const r = rooms.get(code);
  if (!r || r.closed) throw new LiveError(404, "Không tìm thấy phòng — kiểm tra lại mã phòng");
  return r;
}
function assertHost(r: Room, key: string) {
  if (!safeEq(r.hostKey, key)) throw new LiveError(403, "Bạn không phải người tạo phòng này");
}
function getPlayer(r: Room, id: string, tok: string) {
  const p = r.players.get(id);
  if (!p || !safeEq(p.token, tok)) throw new LiveError(403, "Phiên tham gia không hợp lệ, hãy vào lại phòng");
  if (p.kicked) throw new LiveError(403, "Bạn đã được mời ra khỏi phòng");
  return p;
}

/* ---------- học sinh ---------- */
export function joinRoom(code: string, rawName: string, rawClass: string | null) {
  const r = getRoom(code);
  if (r.phase === "ended") throw new LiveError(409, "Phòng đã kết thúc");
  const active = [...r.players.values()].filter((p) => !p.kicked);
  if (active.length >= LIVE_LIMITS.maxPlayers) throw new LiveError(409, "Phòng đã đủ người");
  const base = rawName.replace(/\s+/g, " ").trim().slice(0, LIVE_LIMITS.nameMax);
  if (!base) throw new LiveError(400, "Hãy nhập tên của bạn");
  // tên trùng trong phòng → thêm số thứ tự
  const taken = new Set(active.map((p) => p.name.toLocaleLowerCase("vi")));
  let name = base, n = 2;
  while (taken.has(name.toLocaleLowerCase("vi"))) name = `${base} ${n++}`;

  const id = token().slice(0, 12);
  const p: Player = {
    id, token: token(), name, className: rawClass?.trim().slice(0, 20) || null, joinedAt: Date.now(),
    score: 0, correct: 0, streak: 0, gained: 0, rank: 0, prevRank: null, answers: new Map(), streams: 0, kicked: false,
  };
  r.players.set(id, p);
  rerank(r, false);
  touch(r);
  return { playerId: id, token: p.token, name };
}

export function submitAnswer(code: string, id: string, tok: string, qIndex: number, choice: number) {
  const r = getRoom(code);
  const p = getPlayer(r, id, tok);
  const now = Date.now();
  if (r.phase !== "question" || qIndex !== r.qIndex) throw new LiveError(409, "Câu hỏi này đã đóng");
  if (r.deadline !== null && now > r.deadline + 400) throw new LiveError(409, "Đã hết giờ");
  if (p.answers.has(qIndex)) throw new LiveError(409, "Bạn đã trả lời câu này");
  const q = r.questions[qIndex];
  if (!Number.isInteger(choice) || choice < 0 || choice >= q.options.length) throw new LiveError(400, "Lựa chọn không hợp lệ");

  const timeMs = Math.max(0, now - r.startedAt);
  const correct = choice === q.answerIndex;
  // điểm tính ngay (chuỗi trước câu này không đổi trong lúc đang hỏi) nhưng chỉ cộng khi công bố đáp án
  const { points } = scoreAnswer({
    correct, mode: "arena", level: r.config.level, timeMs, comboBefore: p.streak, limitMs: r.config.seconds * 1000,
  });
  p.answers.set(qIndex, { choice, timeMs, correct, points });
  touch(r);

  // tất cả học sinh đang kết nối đã trả lời → công bố sớm
  const waiting = [...r.players.values()].filter((x) => !x.kicked && x.streams > 0 && !x.answers.has(qIndex));
  if (!waiting.length) {
    clearTimer(r);
    r.timer = setTimeout(() => reveal(r), 700);
  }
  return { ok: true };
}

/* ---------- giáo viên ---------- */
export function hostAction(code: string, key: string, action: HostAction, playerId?: string) {
  const r = getRoom(code);
  assertHost(r, key);
  switch (action) {
    case "start":
      if (r.phase !== "lobby") throw new LiveError(409, "Phòng đã bắt đầu");
      r.firstStartedAt = Date.now();
      startQuestion(r, 0);
      break;
    case "reveal":
      if (r.phase !== "question") throw new LiveError(409, "Không có câu hỏi đang mở");
      reveal(r);
      break;
    case "leaderboard":
      if (r.phase !== "reveal") throw new LiveError(409, "Chưa công bố đáp án");
      r.phase = "leaderboard";
      touch(r);
      break;
    case "next":
      if (r.phase !== "reveal" && r.phase !== "leaderboard") throw new LiveError(409, "Chưa thể chuyển câu");
      if (r.qIndex + 1 >= r.questions.length) finish(r);
      else startQuestion(r, r.qIndex + 1);
      break;
    case "end":
      if (r.phase === "question") reveal(r, false);
      finish(r);
      break;
    case "kick": {
      const p = playerId ? r.players.get(playerId) : undefined;
      if (!p) throw new LiveError(404, "Không tìm thấy học sinh");
      p.kicked = true;
      rerank(r, false);
      touch(r);
      break;
    }
  }
  return { ok: true };
}

function startQuestion(r: Room, i: number) {
  clearTimer(r);
  r.phase = "question";
  r.qIndex = i;
  r.startedAt = Date.now();
  r.deadline = r.startedAt + r.config.seconds * 1000;
  r.timer = setTimeout(() => reveal(r), r.config.seconds * 1000 + 450);
  touch(r);
}

function reveal(r: Room, notify = true) {
  if (r.phase !== "question") return;
  clearTimer(r);
  for (const p of r.players.values()) {
    const a = p.answers.get(r.qIndex);
    p.gained = a?.points ?? 0;
    p.score += p.gained;
    if (a?.correct) { p.correct++; p.streak++; } else p.streak = 0;
  }
  r.phase = "reveal";
  r.deadline = null;
  // câu đầu tiên chưa có hạng trước đó để so sánh
  rerank(r, r.qIndex > 0);
  if (notify) touch(r);
}

function finish(r: Room) {
  clearTimer(r);
  r.phase = "ended";
  r.deadline = null;
  touch(r);
  saveResults(r);
}

/** Lưu kết quả vào DB để giáo viên xem lại (trang /giao-vien). Lỗi lưu không làm hỏng buổi học. */
function saveResults(r: Room) {
  const players = sortedPlayers(r);
  const asked = r.qIndex + 1;
  if (!players.length || asked <= 0) return;
  try {
    getDb().insert(liveSessions).values({
      code: r.code, grade: r.config.grade, level: r.config.level, subjects: r.config.subjects,
      questionCount: asked, playerCount: players.length, hostUserId: r.hostUserId,
      results: players.map((p) => ({ rank: p.rank, name: p.name, className: p.className, score: p.score, correct: p.correct })),
      questionStats: r.questions.slice(0, asked).map((q, i) => {
        const answered = players.filter((p) => p.answers.has(i));
        const right = answered.filter((p) => p.answers.get(i)!.correct).length;
        return { content: q.content, subject: q.subject, correctPct: Math.round((100 * right) / players.length) };
      }),
      startedAt: new Date(r.firstStartedAt || Date.now()),
    }).run();
  } catch (e) {
    console.error("[live] không lưu được kết quả phòng", r.code, e);
  }
}

function clearTimer(r: Room) {
  if (r.timer) clearTimeout(r.timer);
  r.timer = null;
}

/** Xếp hạng: điểm ↓, số câu đúng ↓, vào phòng sớm hơn; bằng điểm và bằng số câu đúng thì đồng hạng */
function rerank(r: Room, keepPrev: boolean) {
  const list = sortedPlayers(r);
  list.forEach((p, i) => {
    p.prevRank = keepPrev ? p.rank || null : null;
    const prev = list[i - 1];
    p.rank = prev && prev.score === p.score && prev.correct === p.correct ? prev.rank : i + 1;
  });
}
const sortedPlayers = (r: Room) =>
  [...r.players.values()].filter((p) => !p.kicked)
    .sort((a, b) => b.score - a.score || b.correct - a.correct || a.joinedAt - b.joinedAt);

/* ---------- phát trạng thái ---------- */
function touch(r: Room) {
  r.lastActivity = Date.now();
  // gộp nhiều thay đổi liên tiếp (vd 40 học sinh trả lời cùng lúc) thành 1 lần gửi
  if (r.notifyTimer) return;
  r.notifyTimer = setTimeout(() => {
    r.notifyTimer = null;
    for (const l of r.listeners) l.send(viewFor(r, l));
  }, 60);
}

function viewFor(r: Room, l: Listener): LiveView {
  return l.kind === "host" ? hostView(r) : playerView(r, l.playerId);
}

function questionView(r: Room) {
  const q = r.questions[r.qIndex];
  return r.phase === "lobby" || r.phase === "ended" || !q ? null : { subject: q.subject, content: q.content, options: q.options };
}

function rankRows(r: Room): LiveRankRow[] {
  return sortedPlayers(r).map((p) => ({
    id: p.id, name: p.name, className: p.className, score: p.score, rank: p.rank, prevRank: p.prevRank,
    gained: p.gained, correct: p.correct, streak: p.streak,
  }));
}

function revealData(r: Room) {
  if (r.phase !== "reveal" && r.phase !== "leaderboard" && !(r.phase === "ended" && r.qIndex >= 0)) return null;
  const q = r.questions[r.qIndex];
  const counts = q.options.map(() => 0);
  let noAnswer = 0;
  for (const p of r.players.values()) {
    if (p.kicked) continue;
    const a = p.answers.get(r.qIndex);
    if (a) counts[a.choice]++; else noAnswer++;
  }
  return { answerIndex: q.answerIndex, counts, noAnswer, explanation: q.explanation, explanationReviewed: q.explanationReviewed };
}

function hostView(r: Room): HostView {
  const active = [...r.players.values()].filter((p) => !p.kicked);
  return {
    role: "host", code: r.code, phase: r.phase, config: r.config, qIndex: r.qIndex, total: r.questions.length,
    question: questionView(r), deadline: r.deadline, serverNow: Date.now(),
    answered: r.phase === "question" ? active.filter((p) => p.answers.has(r.qIndex)).length : 0,
    players: active.sort((a, b) => a.joinedAt - b.joinedAt)
      .map((p) => ({ id: p.id, name: p.name, className: p.className, online: p.streams > 0, score: p.score })),
    reveal: r.phase === "ended" ? null : revealData(r),
    ranking: r.phase === "lobby" || r.phase === "question" ? [] : rankRows(r),
  };
}

function playerView(r: Room, id: string): PlayerView {
  const p = r.players.get(id);
  const of = [...r.players.values()].filter((x) => !x.kicked).length;
  const base = {
    role: "player" as const, code: r.code, seconds: r.config.seconds, qIndex: r.qIndex, total: r.questions.length,
    deadline: r.deadline, serverNow: Date.now(),
  };
  if (!p || p.kicked || r.closed) {
    return { ...base, phase: r.closed ? "closed" : "kicked", question: null, me: { id, name: p?.name ?? "", score: 0, rank: 0, of, correct: 0, streak: 0 }, myChoice: null, result: null, podium: [] };
  }
  const a = p.answers.get(r.qIndex);
  const rv = r.phase === "reveal" || r.phase === "leaderboard" ? revealData(r) : null;
  return {
    ...base,
    phase: r.phase,
    question: questionView(r),
    me: { id: p.id, name: p.name, score: p.score, rank: p.rank, of, correct: p.correct, streak: p.streak },
    myChoice: a?.choice ?? null,
    result: rv ? {
      answered: !!a, correct: !!a?.correct, points: a?.points ?? 0, answerIndex: rv.answerIndex,
      explanation: rv.explanation, explanationReviewed: rv.explanationReviewed,
    } : null,
    podium: r.phase === "ended" ? sortedPlayers(r).slice(0, 3).map((x) => ({ name: x.name, score: x.score, rank: x.rank })) : [],
  };
}

/** Đăng ký nhận trạng thái qua SSE. Trả về hàm huỷ đăng ký. */
export function subscribe(
  code: string,
  who: { role: "host"; key: string } | { role: "player"; id: string; token: string },
  send: (v: LiveView) => void,
) {
  const r = getRoom(code);
  let l: Listener;
  if (who.role === "host") {
    assertHost(r, who.key);
    l = { kind: "host", send };
  } else {
    const p = getPlayer(r, who.id, who.token);
    p.streams++;
    l = { kind: "player", playerId: p.id, send };
  }
  r.listeners.add(l);
  send(viewFor(r, l));
  touch(r); // báo cho màn hình giáo viên: có người vừa kết nối
  return () => {
    r.listeners.delete(l);
    if (l.kind === "player") {
      const p = r.players.get(l.playerId);
      if (p) p.streams = Math.max(0, p.streams - 1);
    }
    if (!r.closed) touch(r);
  };
}

function closeRoom(r: Room) {
  clearTimer(r);
  r.closed = true;
  for (const l of r.listeners) l.send(viewFor(r, l));
  r.listeners.clear();
  rooms.delete(r.code);
}

export function roomExists(code: string) {
  const r = rooms.get(code);
  return !!r && !r.closed && r.phase !== "ended";
}
