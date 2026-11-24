/**
 * Nghiệp vụ dành cho giáo viên: ngân hàng câu hỏi, báo lỗi/góp ý, bài giao, lịch sử lớp học trực tiếp.
 * Mọi hàm ở đây giả định người gọi ĐÃ được kiểm tra quyền (xem requireTeacher).
 */
import { randomInt } from "node:crypto";
import { and, count, desc, eq, inArray, like, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assignments, assignmentSubmissions, attempts, feedbacks, liveSessions, questionReports, questions, user,
} from "@/db/schema";
import { getSessionUser, type SessionUser } from "./auth";
import { fail } from "./http";

/* ---------------- quyền ---------------- */
export async function requireTeacher(headers: Headers): Promise<{ user: SessionUser } | { error: Response }> {
  const u = await getSessionUser(headers);
  if (!u) return { error: fail(401, "Cần đăng nhập bằng tài khoản giáo viên") };
  if (!u.isTeacher) return { error: fail(403, "Tài khoản này chưa được cấp quyền giáo viên") };
  return { user: u };
}

/* ---------------- tổng quan ---------------- */
export function overview() {
  const db = getDb();
  const weekAgo = Math.floor(Date.now() / 1000) - 7 * 86400;
  const one = <T,>(q: { get: () => T | undefined }) => q.get();
  return {
    questions: one(db.select({ n: count() }).from(questions).where(eq(questions.isActive, true)))?.n ?? 0,
    hidden: one(db.select({ n: count() }).from(questions).where(eq(questions.isActive, false)))?.n ?? 0,
    drafts: one(db.select({ n: count() }).from(questions).where(and(eq(questions.isActive, true), eq(questions.explanationReviewed, false))))?.n ?? 0,
    openReports: one(db.select({ n: count() }).from(questionReports).where(eq(questionReports.status, "open")))?.n ?? 0,
    attemptsWeek: one(db.select({ n: count() }).from(attempts).where(sql`${attempts.createdAt} >= ${weekAgo}`))?.n ?? 0,
    students: one(db.select({ n: count() }).from(user))?.n ?? 0,
    assignmentsOpen: one(db.select({ n: count() }).from(assignments).where(eq(assignments.isOpen, true)))?.n ?? 0,
    liveSessions: one(db.select({ n: count() }).from(liveSessions))?.n ?? 0,
    // câu sai nhiều nhất (≥ 5 lượt trả lời) — gợi ý ôn tập / kiểm tra lại câu hỏi
    hardest: db.all<{ id: number; code: string; subject: string; content: string; total: number; pct: number }>(sql`
      SELECT q.id, q.code, q.subject, q.content, COUNT(*) AS total,
             ROUND(100.0 * SUM(aa.is_correct) / COUNT(*)) AS pct
      FROM attempt_answers aa JOIN questions q ON q.id = aa.question_id
      GROUP BY q.id HAVING COUNT(*) >= 5 ORDER BY pct ASC, total DESC LIMIT 6`),
  };
}

/* ---------------- ngân hàng câu hỏi ---------------- */
export interface QuestionFilter {
  grade?: number; level?: "basic" | "advanced"; subject?: string; q?: string;
  status?: "all" | "active" | "hidden" | "draft" | "reported"; page: number; pageSize: number;
}

const openReportCount = sql<number>`(SELECT COUNT(*) FROM question_reports r WHERE r.question_id = ${questions.id} AND r.status = 'open')`;

function questionWhere(f: Omit<QuestionFilter, "page" | "pageSize">) {
  const c: (SQL | undefined)[] = [
    f.grade ? eq(questions.grade, f.grade) : undefined,
    f.level ? eq(questions.level, f.level) : undefined,
    f.subject ? eq(questions.subject, f.subject) : undefined,
  ];
  if (f.q?.trim()) {
    const k = `%${f.q.trim()}%`;
    c.push(or(like(questions.content, k), like(questions.code, k), like(questions.topic, k)));
  }
  if (f.status === "active") c.push(eq(questions.isActive, true));
  if (f.status === "hidden") c.push(eq(questions.isActive, false));
  if (f.status === "draft") c.push(and(eq(questions.explanationReviewed, false), eq(questions.isActive, true)));
  if (f.status === "reported") c.push(sql`${openReportCount} > 0`);
  return and(...c);
}

export function listQuestions(f: QuestionFilter) {
  const db = getDb();
  const where = questionWhere(f);
  const total = db.select({ n: count() }).from(questions).where(where).get()?.n ?? 0;
  const items = db
    .select({
      id: questions.id, code: questions.code, grade: questions.grade, level: questions.level, subject: questions.subject,
      topic: questions.topic, content: questions.content, options: questions.options, answerIndex: questions.answerIndex,
      explanation: questions.explanation, explanationReviewed: questions.explanationReviewed, isActive: questions.isActive,
      openReports: openReportCount,
    })
    .from(questions).where(where).orderBy(questions.grade, questions.level, questions.code)
    .limit(f.pageSize).offset((f.page - 1) * f.pageSize).all();
  return { total, items };
}

export interface QuestionInput {
  code?: string | null; grade: number; level: "basic" | "advanced"; subject: string; topic?: string | null;
  content: string; options: string[]; answerIndex: number; explanation?: string | null;
  explanationReviewed: boolean; isActive: boolean;
}

/** Mã tiếp theo theo mẫu "<khối>-<CB|NC>-<số>" */
function nextCode(grade: number, level: "basic" | "advanced") {
  const prefix = `${grade}-${level === "basic" ? "CB" : "NC"}-`;
  const rows = getDb().select({ code: questions.code }).from(questions).where(like(questions.code, `${prefix}%`)).all();
  const max = rows.reduce((m, r) => Math.max(m, Number(r.code.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function createQuestion(d: QuestionInput) {
  const code = d.code?.trim() || nextCode(d.grade, d.level);
  const row = getDb().insert(questions).values({ ...d, code, topic: d.topic || null, explanation: d.explanation || null })
    .returning({ id: questions.id, code: questions.code }).get();
  return row;
}

export function updateQuestion(id: number, d: Partial<QuestionInput>) {
  const { code, ...rest } = d;
  const r = getDb().update(questions)
    .set({ ...rest, ...(code ? { code: code.trim() } : {}), updatedAt: new Date() })
    .where(eq(questions.id, id)).returning({ id: questions.id }).get();
  return r ?? null;
}

/* ---- CSV (mở bằng Excel) ---- */
export const CSV_HEADER = ["ma", "khoi", "cap_do", "mon", "chu_de", "cau_hoi", "a", "b", "c", "d", "dap_an", "giai_thich", "da_duyet", "hien"];

export function questionsToCsv(f: Omit<QuestionFilter, "page" | "pageSize">) {
  const rows = getDb().select().from(questions).where(questionWhere(f)).orderBy(questions.grade, questions.level, questions.code).all();
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [CSV_HEADER.join(",")];
  for (const q of rows) {
    const o = [...q.options, "", "", "", ""].slice(0, 4);
    lines.push([
      q.code, q.grade, q.level === "basic" ? "co-ban" : "nang-cao", q.subject, q.topic, q.content, ...o,
      "ABCD"[q.answerIndex], q.explanation, q.explanationReviewed ? 1 : 0, q.isActive ? 1 : 0,
    ].map(esc).join(","));
  }
  return "﻿" + lines.join("\r\n");
}

/** Phân tích CSV chuẩn RFC 4180 (hỗ trợ dấu phẩy/xuống dòng trong ngoặc kép, dấu ; của Excel tiếng Việt) */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.slice(0, src.indexOf("\n") === -1 ? undefined : src.indexOf("\n"));
  const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (q) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === sep) { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

export interface ImportResult { created: number; updated: number; errors: { line: number; message: string }[] }

/** Nhập câu hỏi từ CSV. Có cột "ma" trùng mã sẵn có → cập nhật; không có → tạo mới. dryRun = chỉ kiểm tra. */
export function importQuestions(text: string, dryRun: boolean): ImportResult {
  const rows = parseCsv(text);
  const res: ImportResult = { created: 0, updated: 0, errors: [] };
  if (!rows.length) { res.errors.push({ line: 0, message: "File trống" }); return res; }
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const idx = Object.fromEntries(CSV_HEADER.map((h) => [h, head.indexOf(h)]));
  const missing = ["khoi", "cap_do", "mon", "cau_hoi", "a", "b", "dap_an"].filter((h) => idx[h] < 0);
  if (missing.length) { res.errors.push({ line: 1, message: `Thiếu cột: ${missing.join(", ")}` }); return res; }

  const db = getDb();
  const existing = new Map(db.select({ id: questions.id, code: questions.code }).from(questions).all().map((r) => [r.code, r.id]));
  const ops: (() => void)[] = [];
  const get = (r: string[], h: string) => (idx[h] >= 0 ? (r[idx[h]] ?? "").trim() : "");

  rows.slice(1).forEach((r, i) => {
    const line = i + 2;
    const grade = Number(get(r, "khoi"));
    const lv = get(r, "cap_do").toLowerCase().replace(/\s+/g, "-");
    const level = ["co-ban", "cơ-bản", "basic", "cb"].includes(lv) ? "basic" : ["nang-cao", "nâng-cao", "advanced", "nc"].includes(lv) ? "advanced" : null;
    const options = ["a", "b", "c", "d"].map((h) => get(r, h)).filter(Boolean);
    const ans = "ABCD".indexOf(get(r, "dap_an").toUpperCase());
    const content = get(r, "cau_hoi");
    const err = !(grade >= 6 && grade <= 9) ? "Khối phải từ 6 đến 9"
      : !level ? "Cấp độ phải là co-ban hoặc nang-cao"
      : !get(r, "mon") ? "Thiếu môn"
      : !content ? "Thiếu nội dung câu hỏi"
      : options.length < 2 ? "Cần ít nhất 2 đáp án (cột a, b)"
      : ans < 0 || ans >= options.length ? "Cột dap_an phải là A/B/C/D và trỏ tới đáp án có nội dung"
      : null;
    if (err) { res.errors.push({ line, message: err }); return; }
    const flag = (h: string, def: boolean) => { const v = get(r, h); return v === "" ? def : ["1", "x", "true", "có", "co"].includes(v.toLowerCase()); };
    const data: QuestionInput = {
      grade, level: level!, subject: get(r, "mon"), topic: get(r, "chu_de") || null, content, options, answerIndex: ans,
      explanation: get(r, "giai_thich") || null, explanationReviewed: flag("da_duyet", true), isActive: flag("hien", true),
    };
    const code = get(r, "ma");
    const id = code ? existing.get(code) : undefined;
    if (id) { res.updated++; ops.push(() => updateQuestion(id, data)); }
    else { res.created++; ops.push(() => { const c = createQuestion({ ...data, code: code || null }); existing.set(c.code, c.id); }); }
  });
  if (!dryRun && !res.errors.length) db.transaction(() => ops.forEach((op) => op()));
  return res;
}

/* ---------------- báo lỗi & góp ý ---------------- */
export function listReports(status: "open" | "resolved" | "rejected") {
  return getDb()
    .select({
      id: questionReports.id, reason: questionReports.reason, note: questionReports.note, status: questionReports.status,
      createdAt: questionReports.createdAt, questionId: questions.id, code: questions.code, content: questions.content,
      subject: questions.subject, grade: questions.grade,
    })
    .from(questionReports).innerJoin(questions, eq(questions.id, questionReports.questionId))
    .where(eq(questionReports.status, status)).orderBy(desc(questionReports.createdAt)).limit(200).all();
}

export function setReportStatus(ids: number[], status: "open" | "resolved" | "rejected") {
  if (!ids.length) return 0;
  return getDb().update(questionReports).set({ status }).where(inArray(questionReports.id, ids)).run().changes;
}

export function listFeedback(limit = 100) {
  return getDb().select().from(feedbacks).orderBy(desc(feedbacks.createdAt)).limit(limit).all();
}

/* ---------------- bài giao ---------------- */
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ ký tự dễ nhầm I/O/0/1
const newCode = () => Array.from({ length: 6 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");

export interface AssignmentInput {
  title: string; note?: string | null; grade: number; level: "basic" | "advanced"; subjects: string[];
  count: number; mode: "practice" | "test"; timeLimitMin?: number | null; dueAt?: number | null;
}

export function createAssignment(d: AssignmentInput, by: string) {
  const db = getDb();
  const ids = db.select({ id: questions.id }).from(questions)
    .where(and(eq(questions.isActive, true), eq(questions.grade, d.grade), eq(questions.level, d.level),
      d.subjects.length ? inArray(questions.subject, d.subjects) : undefined))
    .orderBy(sql`random()`).limit(d.count).all().map((r) => r.id);
  if (!ids.length) throw new Error("Không có câu hỏi phù hợp");
  let code = newCode();
  while (db.select({ id: assignments.id }).from(assignments).where(eq(assignments.code, code)).get()) code = newCode();
  return db.insert(assignments).values({
    code, title: d.title, note: d.note || null, grade: d.grade, level: d.level, subjects: d.subjects, questionIds: ids,
    mode: d.mode, timeLimitMin: d.timeLimitMin || null, dueAt: d.dueAt ? new Date(d.dueAt) : null, createdBy: by,
  }).returning().get();
}

export function listAssignments() {
  return getDb().all<{
    id: number; code: string; title: string; grade: number; level: string; mode: string; is_open: number;
    due_at: number | null; created_at: number; question_count: number; submissions: number; students: number; avg10: number | null;
  }>(sql`
    SELECT a.id, a.code, a.title, a.grade, a.level, a.mode, a.is_open, a.due_at, a.created_at,
           json_array_length(a.question_ids) AS question_count,
           COUNT(s.id) AS submissions,
           COUNT(DISTINCT lower(s.player_name) || '|' || ifnull(s.class_name, '')) AS students,
           ROUND(AVG(s.score10_x100) / 100.0, 2) AS avg10
    FROM assignments a LEFT JOIN assignment_submissions s ON s.assignment_id = a.id
    GROUP BY a.id ORDER BY a.created_at DESC`);
}

export function assignmentDetail(id: number) {
  const db = getDb();
  const a = db.select().from(assignments).where(eq(assignments.id, id)).get();
  if (!a) return null;
  const subs = db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.assignmentId, id))
    .orderBy(desc(assignmentSubmissions.createdAt)).all();
  const qs = db.select({ id: questions.id, content: questions.content, subject: questions.subject, options: questions.options, answerIndex: questions.answerIndex })
    .from(questions).where(inArray(questions.id, a.questionIds)).all();
  const byId = new Map(qs.map((q) => [q.id, q]));
  // tỉ lệ đúng từng câu, tính trên lần nộp gần nhất của mỗi học sinh
  const latest = new Map<string, (typeof subs)[number]>();
  for (const s of subs) { const k = `${s.playerName.toLowerCase()}|${s.className ?? ""}`; if (!latest.has(k)) latest.set(k, s); }
  const stats = a.questionIds.map((qid) => {
    const q = byId.get(qid);
    let right = 0, total = 0;
    for (const s of latest.values()) { const ans = s.answers.find((x) => x.questionId === qid); if (ans) { total++; if (ans.isCorrect) right++; } }
    return { id: qid, content: q?.content ?? "(câu đã bị xoá)", subject: q?.subject ?? "", correctPct: total ? Math.round((100 * right) / total) : null };
  });
  return {
    assignment: a,
    submissions: subs.map((s) => ({ ...s, score10: s.score10 / 100, answers: undefined })),
    latestCount: latest.size,
    stats,
  };
}

export function updateAssignment(id: number, d: { isOpen?: boolean; dueAt?: number | null; title?: string; note?: string | null }) {
  return getDb().update(assignments).set({
    ...(d.isOpen !== undefined ? { isOpen: d.isOpen } : {}),
    ...(d.dueAt !== undefined ? { dueAt: d.dueAt ? new Date(d.dueAt) : null } : {}),
    ...(d.title ? { title: d.title } : {}),
    ...(d.note !== undefined ? { note: d.note || null } : {}),
  }).where(eq(assignments.id, id)).returning({ id: assignments.id }).get() ?? null;
}

export function deleteAssignment(id: number) {
  return getDb().delete(assignments).where(eq(assignments.id, id)).run().changes;
}

/* ---------------- lớp học trực tiếp ---------------- */
export function listLiveSessions() {
  return getDb().select().from(liveSessions).orderBy(desc(liveSessions.endedAt)).limit(100).all();
}
