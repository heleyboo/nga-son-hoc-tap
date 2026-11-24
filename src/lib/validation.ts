import { z } from "zod";
import { DIFFICULTIES, LEVELS, MODES } from "@/db/schema";

const grade = z.coerce.number().int().min(6).max(9);
const level = z.enum(LEVELS);
const name = z.string().trim().min(1).max(40);

export const quizQuery = z.object({
  grade,
  level,
  subjects: z
    .string()
    .optional()
    .transform((s) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : [])),
  count: z.coerce.number().int().min(1).max(50).default(10),
});

export const checkInput = z.object({
  selectedIndex: z.number().int().min(0).max(5).nullable(),
});

export const attemptInput = z.object({
  playerName: name,
  className: z.string().trim().max(20).optional(),
  grade,
  level,
  mode: z.enum(MODES).default("practice"),
  durationSec: z.number().int().min(0).max(4 * 3600).default(0),
  isRetry: z.boolean().default(false),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        selectedIndex: z.number().int().min(0).max(5).nullable(),
        timeMs: z.number().int().min(0).max(3_600_000).optional(),
      }),
    )
    .min(1)
    .max(50),
});

export const feedbackInput = z.object({
  attemptId: z.number().int().positive().optional(),
  playerName: name.optional(),
  grade: grade.optional(),
  level: level.optional(),
  rating: z.number().int().min(1).max(5),
  difficulty: z.enum(DIFFICULTIES).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  comment: z.string().trim().max(1000).optional(),
});

export const reportInput = z.object({
  attemptId: z.number().int().positive().optional(),
  reason: z.enum(["wrong_answer", "unclear", "typo", "other"]),
  note: z.string().trim().max(500).optional(),
});

export const leaderboardQuery = z.object({
  grade: z
    .union([z.literal("all"), z.coerce.number().int().min(6).max(9)])
    .default("all"),
  level: z.union([z.literal("all"), level]).default("all"),
  mode: z.enum(MODES).default("arena"),
  period: z.enum(["week", "month", "all"]).default("week"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const meUpdate = z.object({
  nickname: z.string().trim().min(1).max(24),
  className: z
    .string()
    .trim()
    .max(8)
    .transform((s) => s.toUpperCase())
    .optional(),
});

export type LeaderboardQuery = z.infer<typeof leaderboardQuery>;
export type QuizQuery = z.infer<typeof quizQuery>;
export type AttemptInput = z.infer<typeof attemptInput>;
export type FeedbackInput = z.infer<typeof feedbackInput>;
export type ReportInput = z.infer<typeof reportInput>;
