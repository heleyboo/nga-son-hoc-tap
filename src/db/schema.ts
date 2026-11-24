import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

export const LEVELS = ["basic", "advanced"] as const;
export const MODES = ["practice", "arena"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const REPORT_STATUSES = ["open", "resolved", "rejected"] as const;

/** Kho câu hỏi trắc nghiệm */
export const questions = sqliteTable(
  "questions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** Mã ổn định để seed/import không bị trùng, vd "6-CB-001" */
    code: text("code").notNull().unique(),
    grade: integer("grade").notNull(),
    level: text("level", { enum: LEVELS }).notNull(),
    subject: text("subject").notNull(),
    topic: text("topic"),
    content: text("content").notNull(),
    options: text("options", { mode: "json" }).$type<string[]>().notNull(),
    answerIndex: integer("answer_index").notNull(),
    explanation: text("explanation"),
    /** false = giải thích là bản nháp (soạn tự động), chờ giáo viên duyệt */
    explanationReviewed: integer("explanation_reviewed", { mode: "boolean" }).notNull().default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: createdAt(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("questions_grade_level_idx").on(t.grade, t.level, t.isActive),
    index("questions_subject_idx").on(t.subject),
    check("questions_grade_chk", sql`${t.grade} between 6 and 9`),
  ],
);

/** Một lượt làm bài */
export const attempts = sqliteTable(
  "attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** null = khách (không đăng nhập) — không lên bảng xếp hạng */
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    playerName: text("player_name").notNull(),
    className: text("class_name"),
    grade: integer("grade").notNull(),
    level: text("level", { enum: LEVELS }).notNull(),
    mode: text("mode", { enum: MODES }).notNull().default("practice"),
    subjects: text("subjects", { mode: "json" }).$type<string[]>().notNull(),
    totalQuestions: integer("total_questions").notNull(),
    correctCount: integer("correct_count").notNull(),
    score: integer("score").notNull(),
    maxStreak: integer("max_streak").notNull().default(0),
    durationSec: integer("duration_sec").notNull().default(0),
    /** lượt "làm lại các câu sai" — không tính bảng xếp hạng/điểm cao */
    isRetry: integer("is_retry", { mode: "boolean" }).notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [
    index("attempts_board_idx").on(t.grade, t.level, t.score),
    index("attempts_created_idx").on(t.createdAt),
    index("attempts_user_idx").on(t.userId, t.createdAt),
  ],
);

/** Từng câu trả lời trong một lượt — dùng cho "xem lại câu sai" và thống kê câu khó */
export const attemptAnswers = sqliteTable(
  "attempt_answers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    attemptId: integer("attempt_id")
      .notNull()
      .references(() => attempts.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    /** null = hết giờ / bỏ qua */
    selectedIndex: integer("selected_index"),
    isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
    timeMs: integer("time_ms"),
  },
  (t) => [
    index("answers_attempt_idx").on(t.attemptId),
    index("answers_question_idx").on(t.questionId),
  ],
);

/** Nhận xét, đánh giá của người làm */
export const feedbacks = sqliteTable(
  "feedbacks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    attemptId: integer("attempt_id").references(() => attempts.id, {
      onDelete: "set null",
    }),
    playerName: text("player_name"),
    grade: integer("grade"),
    level: text("level", { enum: LEVELS }),
    rating: integer("rating").notNull(),
    difficulty: text("difficulty", { enum: DIFFICULTIES }),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
    comment: text("comment"),
    createdAt: createdAt(),
  },
  (t) => [
    index("feedbacks_created_idx").on(t.createdAt),
    check("feedbacks_rating_chk", sql`${t.rating} between 1 and 5`),
  ],
);

/** Báo lỗi một câu hỏi (🚩) */
export const questionReports = sqliteTable(
  "question_reports",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    attemptId: integer("attempt_id").references(() => attempts.id, {
      onDelete: "set null",
    }),
    reason: text("reason").notNull(),
    note: text("note"),
    status: text("status", { enum: REPORT_STATUSES }).notNull().default("open"),
    createdAt: createdAt(),
  },
  (t) => [index("reports_status_idx").on(t.status, t.questionId)],
);

export const ASSIGNMENT_MODES = ["practice", "test"] as const;

/** Bài giao: bộ câu hỏi cố định, chia sẻ bằng đường dẫn /bai-tap/<code> */
export const assignments = sqliteTable(
  "assignments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").notNull().unique(),
    title: text("title").notNull(),
    note: text("note"),
    grade: integer("grade").notNull(),
    level: text("level", { enum: LEVELS }).notNull(),
    subjects: text("subjects", { mode: "json" }).$type<string[]>().notNull(),
    questionIds: text("question_ids", { mode: "json" }).$type<number[]>().notNull(),
    /** practice = hiện đáp án sau mỗi câu; test = chỉ xem kết quả khi nộp */
    mode: text("mode", { enum: ASSIGNMENT_MODES }).notNull().default("test"),
    /** giới hạn thời gian làm bài (phút), null = không giới hạn */
    timeLimitMin: integer("time_limit_min"),
    dueAt: integer("due_at", { mode: "timestamp" }),
    isOpen: integer("is_open", { mode: "boolean" }).notNull().default(true),
    createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [index("assignments_created_idx").on(t.createdAt)],
);

/** Bài nộp của học sinh (tách khỏi attempts để không ảnh hưởng bảng xếp hạng) */
export const assignmentSubmissions = sqliteTable(
  "assignment_submissions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assignmentId: integer("assignment_id").notNull().references(() => assignments.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    playerName: text("player_name").notNull(),
    className: text("class_name"),
    correctCount: integer("correct_count").notNull(),
    totalQuestions: integer("total_questions").notNull(),
    /** điểm thang 10, làm tròn 0.25 */
    score10: integer("score10_x100").notNull(),
    durationSec: integer("duration_sec").notNull().default(0),
    answers: text("answers", { mode: "json" }).$type<{ questionId: number; selectedIndex: number | null; isCorrect: boolean }[]>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("submissions_assignment_idx").on(t.assignmentId, t.createdAt)],
);

/** Lưu kết quả các phòng "Lớp học trực tiếp" khi kết thúc */
export const liveSessions = sqliteTable(
  "live_sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").notNull(),
    grade: integer("grade").notNull(),
    level: text("level", { enum: LEVELS }).notNull(),
    subjects: text("subjects", { mode: "json" }).$type<string[]>().notNull(),
    questionCount: integer("question_count").notNull(),
    playerCount: integer("player_count").notNull(),
    /** [{rank, name, className, score, correct}] */
    results: text("results", { mode: "json" }).$type<{ rank: number; name: string; className: string | null; score: number; correct: number }[]>().notNull(),
    /** tỉ lệ đúng từng câu: [{content, correctPct}] */
    questionStats: text("question_stats", { mode: "json" }).$type<{ content: string; subject: string; correctPct: number }[]>().notNull(),
    hostUserId: text("host_user_id").references(() => user.id, { onDelete: "set null" }),
    startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
    endedAt: integer("ended_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (t) => [index("live_sessions_ended_idx").on(t.endedAt)],
);

/** Đề "Thử thách mỗi ngày": 5 câu cố định cho mỗi khối mỗi ngày (giờ Việt Nam), chốt khi có người mở lần đầu */
export const dailySets = sqliteTable(
  "daily_sets",
  {
    date: text("date").notNull(), // YYYY-MM-DD
    grade: integer("grade").notNull(),
    questionIds: text("question_ids", { mode: "json" }).$type<number[]>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.date, t.grade] })],
);

export type DailyAnswer = { questionId: number; choice: number | null; correct: boolean; timeMs: number; points: number };

/** Một lượt chơi thử thách ngày. Tài khoản đăng nhập chỉ có 1 lượt tính điểm (ranked) mỗi ngày. */
export const dailyRuns = sqliteTable(
  "daily_runs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    token: text("token").notNull(),
    date: text("date").notNull(),
    grade: integer("grade").notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    ranked: integer("ranked", { mode: "boolean" }).notNull().default(false),
    /** câu đang làm (0..4); = số câu khi đã xong */
    current: integer("current").notNull().default(0),
    /** mốc bắt đầu tính giờ câu hiện tại (ms) */
    shownAt: integer("shown_at").notNull(),
    answers: text("answers", { mode: "json" }).$type<DailyAnswer[]>().notNull().default([]),
    score: integer("score").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    streak: integer("streak").notNull().default(0),
    finishedAt: integer("finished_at"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("daily_runs_ranked_uq").on(t.userId, t.date).where(sql`ranked = 1`),
    index("daily_runs_board_idx").on(t.date, t.grade, t.score),
  ],
);

export const SHARE_KINDS = ["daily", "arena"] as const;
export type ShareCard = {
  name: string; className: string | null; title: string; subtitle: string;
  score: number; correct: number; total: number;
  /** các chỉ số phụ hiển thị dạng thẻ, vd "Chuỗi 3 ngày", "Hạng 2/31" */
  chips: string[];
  /** đường dẫn mời người xem thử sức */
  cta: string;
};

/** Thẻ thành tích chia sẻ: dữ liệu chụp lại từ server lúc tạo (không tin dữ liệu client) */
export const shareCards = sqliteTable(
  "share_cards",
  {
    slug: text("slug").primaryKey(),
    kind: text("kind", { enum: SHARE_KINDS }).notNull(),
    /** id nguồn (daily_runs.id / attempts.id) — mỗi kết quả chỉ có 1 thẻ */
    sourceId: integer("source_id").notNull(),
    card: text("card", { mode: "json" }).$type<ShareCard>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("share_cards_source_uq").on(t.kind, t.sourceId)],
);

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
export type Feedback = typeof feedbacks.$inferSelect;
export type Level = (typeof LEVELS)[number];
export type Mode = (typeof MODES)[number];

/** Kết quả trò chơi STEM của tài khoản (khách lưu trên máy). xp đã áp giới hạn lượt/ngày lúc ghi. */
export const gamePlays = sqliteTable(
  "game_plays",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    game: text("game").notNull(),
    score: integer("score"),
    correct: integer("correct"),
    total: integer("total"),
    answered: integer("answered"),
    level: integer("level"),
    victory: integer("victory", { mode: "boolean" }).notNull().default(false),
    durationSec: integer("duration_sec"),
    xp: integer("xp").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [
    index("game_plays_user_idx").on(t.userId, t.createdAt),
    index("game_plays_board_idx").on(t.game, t.total, t.score),
  ],
);
