import { and, avg, count, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  attemptAnswers,
  attempts,
  feedbacks,
  questionReports,
  questions,
  type Level,
} from "@/db/schema";
import type { SessionUser } from "./auth";
import { scoreRound } from "./scoring";
import type {
  AttemptInput,
  FeedbackInput,
  LeaderboardQuery,
  QuizQuery,
  ReportInput,
} from "./validation";

/** Câu hỏi gửi cho client — KHÔNG kèm đáp án */
export type PublicQuestion = {
  id: number;
  code: string;
  subject: string;
  topic: string | null;
  content: string;
  options: string[];
};

const publicCols = {
  id: questions.id,
  code: questions.code,
  subject: questions.subject,
  topic: questions.topic,
  content: questions.content,
  options: questions.options,
};

export function listSubjects(grade?: number) {
  const db = getDb();
  return db
    .select({
      grade: questions.grade,
      level: questions.level,
      subject: questions.subject,
      total: count(),
    })
    .from(questions)
    .where(
      and(eq(questions.isActive, true), grade ? eq(questions.grade, grade) : undefined),
    )
    .groupBy(questions.grade, questions.level, questions.subject)
    .orderBy(questions.grade, questions.level, questions.subject)
    .all();
}

export function pickQuestions(q: QuizQuery): PublicQuestion[] {
  const db = getDb();
  return db
    .select(publicCols)
    .from(questions)
    .where(
      and(
        eq(questions.isActive, true),
        eq(questions.grade, q.grade),
        eq(questions.level, q.level),
        q.subjects.length ? inArray(questions.subject, q.subjects) : undefined,
      ),
    )
    .orderBy(sql`random()`)
    .limit(q.count)
    .all();
}

/** Kiểm tra 1 câu (dùng cho chế độ Luyện tập: hiện đáp án + giải thích ngay) */
export function checkAnswer(questionId: number, selectedIndex: number | null) {
  const db = getDb();
  const row = db
    .select({
      answerIndex: questions.answerIndex,
      explanation: questions.explanation,
      explanationReviewed: questions.explanationReviewed,
    })
    .from(questions)
    .where(eq(questions.id, questionId))
    .get();
  if (!row) return null;
  return {
    correct: selectedIndex === row.answerIndex,
    answerIndex: row.answerIndex,
    explanation: row.explanation,
    explanationReviewed: row.explanationReviewed,
  };
}

function rateBand(pct: number) {
  if (pct >= 85) return { label: "Xuất sắc", tone: "excellent" } as const;
  if (pct >= 70) return { label: "Tốt", tone: "good" } as const;
  if (pct >= 50) return { label: "Khá", tone: "fair" } as const;
  return { label: "Cần ôn thêm", tone: "weak" } as const;
}

/** Chấm bài ở server (không tin điểm client gửi lên), lưu lượt làm và trả nhận xét tự động */
export function submitAttempt(input: AttemptInput, user: SessionUser | null) {
  const db = getDb();
  // mỗi câu chỉ tính 1 lần
  const seen = new Set<number>();
  const answers = input.answers.filter((a) => !seen.has(a.questionId) && seen.add(a.questionId));
  const ids = [...seen];
  const keyRows = db
    .select({
      id: questions.id,
      subject: questions.subject,
      answerIndex: questions.answerIndex,
      explanation: questions.explanation,
      content: questions.content,
      options: questions.options,
    })
    .from(questions)
    // chỉ nhận câu đúng khối/cấp độ đã khai báo — không thể “mượn” câu dễ để leo bảng xếp hạng
    .where(and(inArray(questions.id, ids), eq(questions.grade, input.grade), eq(questions.level, input.level)))
    .all();
  const key = new Map(keyRows.map((r) => [r.id, r]));

  const graded = answers
    .filter((a) => key.has(a.questionId))
    .map((a) => {
      const k = key.get(a.questionId)!;
      return { ...a, isCorrect: a.selectedIndex === k.answerIndex, k };
    });
  if (!graded.length) throw new Error("Không có câu trả lời hợp lệ");

  const correctCount = graded.filter((g) => g.isCorrect).length;
  const { score, maxStreak } = scoreRound(
    graded.map((g) => ({ correct: g.isCorrect, timeMs: g.timeMs })),
    input.mode,
    input.level,
  );

  const attemptId = db.transaction((tx) => {
    const { id } = tx
      .insert(attempts)
      .values({
        userId: user?.id ?? null,
        playerName: user?.nickname ?? input.playerName,
        className: user?.className ?? input.className,
        isRetry: input.isRetry,
        grade: input.grade,
        level: input.level,
        mode: input.mode,
        subjects: [...new Set(graded.map((g) => g.k.subject))],
        totalQuestions: graded.length,
        correctCount,
        score,
        maxStreak,
        durationSec: input.durationSec,
      })
      .returning({ id: attempts.id })
      .get();
    tx.insert(attemptAnswers)
      .values(
        graded.map((g) => ({
          attemptId: id,
          questionId: g.questionId,
          selectedIndex: g.selectedIndex,
          isCorrect: g.isCorrect,
          timeMs: g.timeMs,
        })),
      )
      .run();
    return id;
  });

  // Nhận xét tự động theo môn
  const bySubject = new Map<string, { correct: number; total: number }>();
  for (const g of graded) {
    const s = bySubject.get(g.k.subject) ?? { correct: 0, total: 0 };
    s.total++;
    if (g.isCorrect) s.correct++;
    bySubject.set(g.k.subject, s);
  }
  const subjects = [...bySubject].map(([subject, s]) => {
    const pct = Math.round((s.correct / s.total) * 100);
    return { subject, ...s, pct, ...rateBand(pct) };
  });
  const pct = Math.round((correctCount / graded.length) * 100);
  const weak = subjects.filter((s) => s.tone === "weak").map((s) => s.subject);

  const rank =
    user && !input.isRetry
      ? leaderboard({ grade: input.grade, level: input.level, mode: input.mode, period: "week", limit: 1 }, user.id).me
      : null;

  return {
    attemptId,
    rank: rank ? { position: rank.rank, total: rank.of, period: "week" as const } : null,
    correctCount,
    total: graded.length,
    pct,
    score,
    maxStreak,
    overall: rateBand(pct),
    subjects,
    advice: weak.length
      ? `Nên ôn lại: ${weak.join(", ")}.`
      : pct === 100
        ? "Tuyệt đối! Thử sức với cấp độ Nâng cao nhé."
        : "Kết quả đồng đều, tiếp tục phát huy!",
    review: graded
      .filter((g) => !g.isCorrect)
      .map((g) => ({
        questionId: g.questionId,
        content: g.k.content,
        options: g.k.options,
        selectedIndex: g.selectedIndex,
        answerIndex: g.k.answerIndex,
        explanation: g.k.explanation,
      })),
  };
}

/** Mốc bắt đầu kỳ xếp hạng theo giờ Việt Nam (UTC+7, không đổi giờ), tính bằng giây */
export function periodStart(period: LeaderboardQuery["period"], now = Date.now()): number | null {
  if (period === "all") return null;
  const TZ = 7 * 3600_000, DAY = 86_400_000;
  const local = new Date(now + TZ);
  let startLocal: number;
  if (period === "week") {
    const sinceMonday = (local.getUTCDay() + 6) % 7;
    startLocal = Math.floor((now + TZ) / DAY) * DAY - sinceMonday * DAY;
  } else {
    startLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1);
  }
  return Math.floor((startLocal - TZ) / 1000);
}

type BoardRow = {
  user_id: string; grade: number; level: Level; score: number; correct_count: number; total_questions: number;
  duration_sec: number; max_streak: number; created_at: number; plays: number;
  nickname: string | null; name: string; class_name: string | null;
};

/**
 * Bảng xếp hạng: mỗi tài khoản Google lấy 1 lượt tốt nhất trong kỳ
 * (điểm ↓, số câu đúng ↓, thời gian ↑). Không tính khách và lượt “làm lại câu sai”.
 * Bằng nhau hoàn toàn thì đồng hạng. Không trả email/ảnh của người khác.
 */
export function leaderboard(q: LeaderboardQuery, meId?: string | null) {
  const since = periodStart(q.period);
  const conds = [sql`a.user_id IS NOT NULL`, sql`a.is_retry = 0`, sql`a.mode = ${q.mode}`];
  if (q.grade !== "all") conds.push(sql`a.grade = ${q.grade}`);
  if (q.level !== "all") conds.push(sql`a.level = ${q.level}`);
  if (since !== null) conds.push(sql`a.created_at >= ${since}`);

  const rows = getDb().all<BoardRow>(sql`
    WITH ranked AS (
      SELECT a.user_id, a.grade, a.level, a.score, a.correct_count, a.total_questions, a.duration_sec,
             a.max_streak, a.created_at,
             ROW_NUMBER() OVER (PARTITION BY a.user_id
               ORDER BY a.score DESC, a.correct_count DESC, a.duration_sec ASC, a.created_at ASC) AS rn,
             COUNT(*) OVER (PARTITION BY a.user_id) AS plays
      FROM attempts a
      WHERE ${sql.join(conds, sql` AND `)}
    )
    SELECT r.*, u.nickname, u.name, u.class_name
    FROM ranked r JOIN "user" u ON u.id = r.user_id
    WHERE r.rn = 1
    ORDER BY r.score DESC, r.correct_count DESC, r.duration_sec ASC, r.created_at ASC
  `);

  let prev: BoardRow | null = null, rank = 0;
  const all = rows.map((r, i) => {
    const tie = prev && prev.score === r.score && prev.correct_count === r.correct_count && prev.duration_sec === r.duration_sec;
    if (!tie) rank = i + 1;
    prev = r;
    return {
      rank,
      isMe: !!meId && r.user_id === meId,
      name: r.nickname || r.name.split(" ").slice(-1)[0] || "Ẩn danh",
      className: r.class_name,
      grade: r.grade,
      level: r.level,
      score: r.score,
      correctCount: r.correct_count,
      totalQuestions: r.total_questions,
      durationSec: r.duration_sec,
      maxStreak: r.max_streak,
      plays: r.plays,
      createdAt: r.created_at,
    };
  });
  const me = all.find((e) => e.isMe);
  return {
    since,
    total: all.length,
    items: all.slice(0, q.limit),
    me: me ? { ...me, of: all.length } : null,
  };
}

/** Lịch sử của chính người dùng (đồng bộ giữa các máy) */
export function myHistory(userId: string, limit = 100) {
  return getDb()
    .select({
      id: attempts.id,
      createdAt: attempts.createdAt,
      grade: attempts.grade,
      level: attempts.level,
      mode: attempts.mode,
      subjects: attempts.subjects,
      correct: attempts.correctCount,
      total: attempts.totalQuestions,
      score: attempts.score,
      maxStreak: attempts.maxStreak,
      durationSec: attempts.durationSec,
      isRetry: attempts.isRetry,
    })
    .from(attempts)
    .where(eq(attempts.userId, userId))
    .orderBy(desc(attempts.createdAt), desc(attempts.id))
    .limit(limit)
    .all();
}

export function addFeedback(input: FeedbackInput) {
  return getDb()
    .insert(feedbacks)
    .values(input)
    .returning({ id: feedbacks.id })
    .get();
}

export function feedbackSummary(limit = 10) {
  const db = getDb();
  const [stats] = db
    .select({ total: count(), avgRating: avg(feedbacks.rating) })
    .from(feedbacks)
    .all();
  const recent = db
    .select({
      playerName: feedbacks.playerName,
      rating: feedbacks.rating,
      difficulty: feedbacks.difficulty,
      tags: feedbacks.tags,
      comment: feedbacks.comment,
      createdAt: feedbacks.createdAt,
    })
    .from(feedbacks)
    .orderBy(desc(feedbacks.createdAt))
    .limit(limit)
    .all();
  return {
    total: stats.total,
    avgRating: stats.avgRating ? Number(Number(stats.avgRating).toFixed(2)) : null,
    recent,
  };
}

export function reportQuestion(questionId: number, input: ReportInput) {
  const db = getDb();
  const exists = db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.id, questionId))
    .get();
  if (!exists) return null;
  return db
    .insert(questionReports)
    .values({ questionId, ...input })
    .returning({ id: questionReports.id })
    .get();
}
