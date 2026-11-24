/**
 * Tiến trình chung (máy chủ): gom XP từ Đấu Trường, thử thách ngày, bài tập và trò chơi STEM.
 * Luật tính nằm ở progress-rules.ts (dùng chung với trình duyệt cho khách).
 */
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { gamePlays } from "@/db/schema";
import type { GameSlug } from "./modules";
import {
  GAME_RULES, gameXp, summarize, vnDay, xpArena, xpAssignment, xpDaily,
  type GamePlay, type GameResult, type ProgressInput,
} from "./progress-rules";
import { periodStart } from "./quiz";

type Period = "week" | "month" | "all";

/** Dữ liệu thô của một hoặc nhiều tài khoản, từ mốc `since` (giây) */
function inputs(userId: string | null, since: number | null) {
  const db = getDb();
  const u = userId ? sql`AND user_id = ${userId}` : sql`AND user_id IS NOT NULL`;
  const s = since !== null ? sql`AND created_at >= ${since}` : sql``;
  const arena = db.all<{ user_id: string; mode: string; correct: number; is_retry: number; at: number }>(
    sql`SELECT user_id, mode, correct_count AS correct, is_retry, created_at AS at FROM attempts WHERE 1=1 ${u} ${s}`);
  const daily = db.all<{ user_id: string; correct: number; at: number }>(
    sql`SELECT user_id, correct_count AS correct, created_at AS at FROM daily_runs WHERE ranked = 1 AND finished_at IS NOT NULL ${u} ${s}`);
  const assignments = db.all<{ user_id: string; correct: number; at: number }>(
    sql`SELECT user_id, correct_count AS correct, created_at AS at FROM assignment_submissions WHERE 1=1 ${u} ${s}`);
  const games = db.all<{ user_id: string; game: GameSlug; score: number | null; correct: number | null; total: number | null; answered: number | null;
    level: number | null; victory: number; duration_sec: number | null; xp: number; at: number }>(
    sql`SELECT user_id, game, score, correct, total, answered, level, victory, duration_sec, xp, created_at AS at FROM game_plays WHERE 1=1 ${u} ${s} ORDER BY created_at`);

  const byUser = new Map<string, ProgressInput>();
  const get = (id: string) => byUser.get(id) ?? (byUser.set(id, { arena: [], daily: [], assignments: [], games: [] }), byUser.get(id)!);
  for (const r of arena) get(r.user_id).arena.push({ mode: r.mode, correct: r.correct, isRetry: !!r.is_retry, at: r.at * 1000 });
  for (const r of daily) get(r.user_id).daily.push({ correct: r.correct, at: r.at * 1000 });
  for (const r of assignments) get(r.user_id).assignments.push({ correct: r.correct, at: r.at * 1000 });
  for (const r of games) get(r.user_id).games.push({
    game: r.game, score: r.score, correct: r.correct, total: r.total, answered: r.answered, level: r.level,
    victory: !!r.victory, durationSec: r.duration_sec, xp: r.xp, at: r.at * 1000,
  });
  return byUser;
}

/** Hồ sơ tiến trình của một tài khoản */
export function myProgress(userId: string) {
  const input = inputs(userId, null).get(userId) ?? { arena: [], daily: [], assignments: [], games: [] };
  return { ...summarize(input), recentGames: input.games.slice(-12).reverse() };
}

export class ProgressError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Ghi một lượt chơi; XP tính ở máy chủ, áp giới hạn số lượt được tính trong ngày */
export function recordGame(userId: string, r: GameResult) {
  const rule = GAME_RULES[r.game];
  const bad = rule.check(r);
  if (bad) throw new ProgressError(422, bad);
  const db = getDb();
  const now = Date.now();
  const recent = db.all<{ at: number }>(sql`SELECT created_at AS at FROM game_plays WHERE user_id = ${userId} AND game = ${r.game} ORDER BY created_at DESC LIMIT 1`)[0];
  if (recent && now / 1000 - recent.at < 8) throw new ProgressError(429, "Kết quả vừa được ghi");
  // số lượt của game này trong ngày hôm nay (giờ Việt Nam)
  const dayStart = Math.floor(Date.parse(vnDay(now)) / 1000) - 7 * 3600;
  const { n } = db.all<{ n: number }>(sql`SELECT count(*) AS n FROM game_plays WHERE user_id = ${userId} AND game = ${r.game} AND created_at >= ${dayStart}`)[0];
  const xp = gameXp(r, n);
  db.insert(gamePlays).values({
    userId, game: r.game, score: r.score, correct: r.correct, total: r.total, answered: r.answered,
    level: r.level, victory: r.victory, durationSec: r.durationSec, xp,
  }).run();
  const p = myProgress(userId);
  return { xp, capped: xp === 0, progress: { xp: p.xp, rank: p.rank, streak: p.streak, gameBadges: p.gameBadges } };
}

type UserRow = { id: string; name: string; nickname: string | null; class_name: string | null };
function users(ids: string[]) {
  if (!ids.length) return new Map<string, UserRow>();
  const rows = getDb().all<UserRow>(sql`SELECT id, name, nickname, class_name FROM user WHERE id IN (${sql.join(ids.map((i) => sql`${i}`), sql`, `)})`);
  return new Map(rows.map((r) => [r.id, r]));
}
const display = (u?: UserRow) => ({ name: u?.nickname || u?.name || "Học sinh", className: u?.class_name ?? null });

/** Bảng xếp hạng theo XP kiếm được trong kỳ (chỉ tài khoản Google). Không trả email/ảnh. */
export function xpBoard(period: Period, meId?: string | null, limit = 50) {
  const since = periodStart(period);
  const all = [...inputs(null, since)].map(([id, inp]) => ({
    id,
    xp: inp.arena.reduce((s, a) => s + xpArena(a), 0) + inp.daily.reduce((s, d) => s + xpDaily(d.correct), 0)
      + inp.assignments.reduce((s, a) => s + xpAssignment(a.correct), 0) + inp.games.reduce((s, g) => s + g.xp, 0),
  })).filter((x) => x.xp > 0).sort((a, b) => b.xp - a.xp);
  let rank = 0, prev = -1;
  const ranked = all.map((x, i) => { if (x.xp !== prev) { rank = i + 1; prev = x.xp; } return { ...x, rank }; });
  const top = ranked.slice(0, limit);
  const mine = meId ? ranked.find((x) => x.id === meId) : undefined;
  const info = users([...top.map((x) => x.id), ...(mine ? [mine.id] : [])]);
  const row = (x: (typeof ranked)[number]) => ({ rank: x.rank, xp: x.xp, ...display(info.get(x.id)), isMe: x.id === meId });
  return { since: since ? since * 1000 : null, total: ranked.length, items: top.map(row), me: mine ? row(mine) : null };
}

/** Kỷ lục trò chơi: mỗi tài khoản lấy lượt điểm cao nhất (bằng điểm thì nhanh hơn xếp trên) */
export function gameBoard(game: GameSlug, total: number, period: Period, meId?: string | null, limit = 50) {
  const since = periodStart(period);
  const s = since !== null ? sql`AND created_at >= ${since}` : sql``;
  const rows = getDb().all<{ user_id: string; score: number; correct: number | null; duration_sec: number | null; at: number }>(sql`
    WITH r AS (
      SELECT user_id, score, correct, duration_sec, created_at AS at,
             ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY score DESC, COALESCE(duration_sec, 99999) ASC, created_at ASC) AS rn
      FROM game_plays WHERE game = ${game} AND total = ${total} AND score IS NOT NULL ${s}
    )
    SELECT user_id, score, correct, duration_sec, at FROM r WHERE rn = 1
    ORDER BY score DESC, COALESCE(duration_sec, 99999) ASC, at ASC`);
  let rank = 0, prevKey = "";
  const ranked = rows.map((x, i) => { const k = `${x.score}|${x.duration_sec}`; if (k !== prevKey) { rank = i + 1; prevKey = k; } return { ...x, rank }; });
  const top = ranked.slice(0, limit);
  const mine = meId ? ranked.find((x) => x.user_id === meId) : undefined;
  const info = users([...top.map((x) => x.user_id), ...(mine ? [mine.user_id] : [])]);
  const row = (x: (typeof ranked)[number]) => ({
    rank: x.rank, score: x.score, correct: x.correct, durationSec: x.duration_sec, at: x.at * 1000,
    ...display(info.get(x.user_id)), isMe: x.user_id === meId,
  });
  return { since: since ? since * 1000 : null, total: ranked.length, items: top.map(row), me: mine ? row(mine) : null };
}

export type { GamePlay };
