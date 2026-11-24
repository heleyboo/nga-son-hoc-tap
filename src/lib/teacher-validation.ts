import { z } from "zod";

const grade = z.coerce.number().int().min(6).max(9);
const level = z.enum(["basic", "advanced"]);

export const questionFilter = z.object({
  grade: grade.optional(),
  level: level.optional(),
  subject: z.string().max(40).optional(),
  q: z.string().max(100).optional(),
  status: z.enum(["all", "active", "hidden", "draft", "reported"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
});

export const questionBody = z.object({
  code: z.string().trim().max(30).optional().nullable(),
  grade: z.number().int().min(6).max(9),
  level,
  subject: z.string().trim().min(1).max(40),
  topic: z.string().trim().max(80).optional().nullable(),
  content: z.string().trim().min(3, "Nội dung câu hỏi quá ngắn").max(2000),
  options: z.array(z.string().trim().min(1, "Đáp án không được trống").max(500)).min(2).max(6),
  answerIndex: z.number().int().min(0),
  explanation: z.string().trim().max(3000).optional().nullable(),
  explanationReviewed: z.boolean().default(true),
  isActive: z.boolean().default(true),
}).refine((d) => d.answerIndex < d.options.length, { message: "Đáp án đúng không hợp lệ", path: ["answerIndex"] });

export const questionPatch = z.object({
  isActive: z.boolean().optional(),
  explanationReviewed: z.boolean().optional(),
});

export const importBody = z.object({ csv: z.string().min(1).max(3_000_000), dryRun: z.boolean().default(true) });

export const reportPatch = z.object({ ids: z.array(z.number().int()).min(1).max(500), status: z.enum(["open", "resolved", "rejected"]) });

export const assignmentBody = z.object({
  title: z.string().trim().min(2).max(120),
  note: z.string().trim().max(1000).optional().nullable(),
  grade: z.number().int().min(6).max(9),
  level,
  subjects: z.array(z.string().max(40)).max(10).default([]),
  count: z.number().int().min(3).max(40).default(10),
  mode: z.enum(["practice", "test"]).default("test"),
  timeLimitMin: z.number().int().min(1).max(180).optional().nullable(),
  dueAt: z.number().int().optional().nullable(),
});

export const assignmentPatch = z.object({
  isOpen: z.boolean().optional(),
  dueAt: z.number().int().nullable().optional(),
  title: z.string().trim().min(2).max(120).optional(),
  note: z.string().trim().max(1000).nullable().optional(),
});

export const submitBody = z.object({
  name: z.string().trim().min(1).max(40),
  className: z.string().trim().max(20).optional().nullable(),
  durationSec: z.number().min(0).max(86400),
  answers: z.array(z.object({ questionId: z.number().int(), selectedIndex: z.number().int().min(0).max(9).nullable() })).max(100),
});

export const checkBody = z.object({ questionId: z.number().int(), selectedIndex: z.number().int().min(0).max(9).nullable() });
