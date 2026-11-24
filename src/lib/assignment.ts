/** Phía học sinh của "Bài giao": xem đề (không kèm đáp án), kiểm tra từng câu (chế độ luyện tập), nộp bài. */
import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { assignments, assignmentSubmissions, questions } from "@/db/schema";
import type { SessionUser } from "./auth";

const GRACE_MS = 2 * 60 * 1000; // nộp trễ ≤ 2 phút sau hạn vẫn nhận (mạng chậm)

function load(code: string) {
  return getDb().select().from(assignments).where(eq(assignments.code, code.toUpperCase())).get() ?? null;
}
const isClosed = (a: NonNullable<ReturnType<typeof load>>, now = Date.now()) =>
  !a.isOpen || (a.dueAt !== null && now > a.dueAt.getTime() + GRACE_MS);

export function getAssignmentPublic(code: string) {
  const a = load(code);
  if (!a) return null;
  const rows = getDb().select({ id: questions.id, subject: questions.subject, content: questions.content, options: questions.options })
    .from(questions).where(inArray(questions.id, a.questionIds)).all();
  const byId = new Map(rows.map((r) => [r.id, r]));
  return {
    code: a.code, title: a.title, note: a.note, grade: a.grade, level: a.level, mode: a.mode,
    timeLimitMin: a.timeLimitMin, dueAt: a.dueAt?.getTime() ?? null, closed: isClosed(a),
    questions: a.questionIds.map((id) => byId.get(id)).filter((q) => !!q),
  };
}

export function checkAssignmentAnswer(code: string, questionId: number, selected: number | null) {
  const a = load(code);
  if (!a || a.mode !== "practice" || !a.questionIds.includes(questionId)) return null;
  const q = getDb().select({ answerIndex: questions.answerIndex, explanation: questions.explanation, explanationReviewed: questions.explanationReviewed })
    .from(questions).where(eq(questions.id, questionId)).get();
  if (!q) return null;
  return { correct: selected === q.answerIndex, ...q };
}

export class AssignmentError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function submitAssignment(
  code: string,
  input: { name: string; className?: string | null; durationSec: number; answers: { questionId: number; selectedIndex: number | null }[] },
  user: SessionUser | null,
) {
  const a = load(code);
  if (!a) throw new AssignmentError(404, "Không tìm thấy bài tập");
  if (isClosed(a)) throw new AssignmentError(409, "Bài tập đã đóng hoặc đã quá hạn nộp");
  const db = getDb();
  const keys = new Map(db.select({ id: questions.id, answerIndex: questions.answerIndex, explanation: questions.explanation, explanationReviewed: questions.explanationReviewed })
    .from(questions).where(inArray(questions.id, a.questionIds)).all().map((k) => [k.id, k]));
  const given = new Map(input.answers.map((x) => [x.questionId, x.selectedIndex]));
  // chấm theo đúng danh sách câu của bài (câu bỏ trống = sai)
  const graded = a.questionIds.filter((id) => keys.has(id)).map((id) => {
    const sel = given.get(id) ?? null;
    return { questionId: id, selectedIndex: sel, isCorrect: sel === keys.get(id)!.answerIndex };
  });
  const correct = graded.filter((g) => g.isCorrect).length;
  const total = graded.length;
  const score10 = total ? Math.round((correct / total) * 40) / 4 : 0; // làm tròn 0,25
  const limit = a.timeLimitMin ? a.timeLimitMin * 60 + 120 : 6 * 3600;
  db.insert(assignmentSubmissions).values({
    assignmentId: a.id, userId: user?.id ?? null,
    playerName: (user?.nickname ?? input.name).trim().slice(0, 40), className: (user?.className ?? input.className)?.trim().slice(0, 20) || null,
    correctCount: correct, totalQuestions: total, score10: Math.round(score10 * 100),
    durationSec: Math.max(0, Math.min(limit, Math.round(input.durationSec))), answers: graded,
  }).run();
  return {
    correct, total, score10,
    details: graded.map((g) => ({ ...g, answerIndex: keys.get(g.questionId)!.answerIndex, explanation: keys.get(g.questionId)!.explanation, explanationReviewed: keys.get(g.questionId)!.explanationReviewed })),
  };
}
