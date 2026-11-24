/**
 * Thẻ thành tích để chia sẻ. Dữ liệu thẻ được server dựng từ kết quả thật (lượt thử thách ngày đã xác thực
 * bằng token, hoặc lượt Đấu Trường của chính người dùng) rồi lưu lại — người xem chỉ thấy bản chụp đó.
 */
import { randomInt, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { attempts, dailyRuns, shareCards, user as userTable, type ShareCard } from "@/db/schema";
import type { SessionUser } from "./auth";
import { DAILY_COUNT, dailyBoard, myDaily } from "./daily";
import { leaderboard } from "./quiz";

export class ShareError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Địa chỉ công khai của web (cho link chia sẻ và ảnh xem trước trên Zalo/Facebook) */
export const publicOrigin = () =>
  (process.env.LIVE_PUBLIC_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");

const CHARS = "abcdefghijkmnpqrstuvwxyz23456789";
const newSlug = () => Array.from({ length: 8 }, () => CHARS[randomInt(CHARS.length)]).join("");
const fmtDate = (d: string) => d.split("-").reverse().join("/");

function save(kind: "daily" | "arena", sourceId: number, card: ShareCard) {
  const db = getDb();
  const existing = db.select({ slug: shareCards.slug }).from(shareCards).where(and(eq(shareCards.kind, kind), eq(shareCards.sourceId, sourceId))).get();
  if (existing) {
    // cập nhật số liệu mới nhất (vd hạng trong ngày thay đổi) nhưng giữ nguyên đường dẫn
    db.update(shareCards).set({ card }).where(eq(shareCards.slug, existing.slug)).run();
    return existing.slug;
  }
  let slug = newSlug();
  while (db.select({ s: shareCards.slug }).from(shareCards).where(eq(shareCards.slug, slug)).get()) slug = newSlug();
  db.insert(shareCards).values({ slug, kind, sourceId, card }).run();
  return slug;
}

export function shareDaily(runId: number, token: string, guestName: string | null) {
  const db = getDb();
  const run = db.select().from(dailyRuns).where(eq(dailyRuns.id, runId)).get();
  const ok = run && run.token.length === token.length && timingSafeEqual(Buffer.from(run.token), Buffer.from(token));
  if (!run || !ok) throw new ShareError(403, "Không xác thực được lượt chơi");
  if (run.finishedAt === null) throw new ShareError(409, "Hãy hoàn thành thử thách trước khi chia sẻ");
  const u = run.userId ? db.select().from(userTable).where(eq(userTable.id, run.userId)).get() : null;
  const chips: string[] = [];
  if (u && run.ranked) {
    const st = myDaily(u.id);
    if (st.current > 0) chips.push(`Chuỗi ${st.current} ngày liên tiếp`);
    const b = dailyBoard(run.grade, run.date, u.id);
    if (b.me) chips.push(`Hạng ${b.me.rank}/${b.total} khối ${run.grade}`);
  }
  return save("daily", run.id, {
    name: u ? u.nickname || u.name.split(" ").slice(-1)[0] : (guestName?.trim().slice(0, 24) || "Một bạn học sinh"),
    className: u?.className ?? null,
    title: "Thử thách mỗi ngày",
    subtitle: `Khối ${run.grade} · ngày ${fmtDate(run.date)}`,
    score: run.score, correct: run.correctCount, total: DAILY_COUNT, chips, cta: "/thu-thach",
  });
}

export function shareArena(attemptId: number, me: SessionUser | null) {
  const a = getDb().select().from(attempts).where(eq(attempts.id, attemptId)).get();
  if (!a) throw new ShareError(404, "Không tìm thấy lượt làm bài");
  // chỉ chủ lượt làm (tài khoản) được chia sẻ; lượt của khách chỉ chia sẻ được ngay sau khi làm (30 phút)
  const fresh = Date.now() / 1000 - a.createdAt.getTime() / 1000 < 30 * 60;
  if (a.userId ? a.userId !== me?.id : !fresh) throw new ShareError(403, "Bạn chỉ chia sẻ được kết quả của chính mình");
  const pct = a.totalQuestions ? Math.round((100 * a.correctCount) / a.totalQuestions) : 0;
  const chips = [`Chính xác ${pct}%`];
  if (a.maxStreak >= 3) chips.push(`Chuỗi đúng ${a.maxStreak} câu`);
  if (me && a.userId === me.id && !a.isRetry) {
    const r = leaderboard({ grade: a.grade as 6 | 7 | 8 | 9, level: a.level, mode: a.mode, period: "week", limit: 1 }, me.id).me;
    if (r) chips.push(`Hạng ${r.rank}/${r.of} tuần này`);
  }
  return save("arena", a.id, {
    name: a.playerName, className: a.className,
    title: "Đấu Trường Tri Thức",
    subtitle: `Khối ${a.grade} · ${a.level === "basic" ? "Cơ bản" : "Nâng cao"} · ${a.mode === "arena" ? "Thi đấu" : "Luyện tập"}`,
    score: a.score, correct: a.correctCount, total: a.totalQuestions, chips, cta: "/dau-truong",
  });
}

export function getShare(slug: string) {
  return getDb().select().from(shareCards).where(eq(shareCards.slug, slug)).get() ?? null;
}
