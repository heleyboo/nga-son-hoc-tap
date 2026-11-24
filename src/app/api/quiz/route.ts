import { pickQuestions } from "@/lib/quiz";
import { ok, parseQuery } from "@/lib/http";
import { quizQuery } from "@/lib/validation";

/** GET /api/quiz?grade=6&level=basic&subjects=Toán,KHTN&count=10 — đề ngẫu nhiên, không kèm đáp án */
export async function GET(req: Request) {
  const q = parseQuery(req, quizQuery);
  if ("error" in q) return q.error;
  return ok({ items: pickQuestions(q.data) });
}
