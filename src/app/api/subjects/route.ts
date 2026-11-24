import { z } from "zod";
import { listSubjects } from "@/lib/quiz";
import { ok, parseQuery } from "@/lib/http";

/** GET /api/subjects?grade=6 — danh sách môn + số câu theo khối/cấp độ */
export async function GET(req: Request) {
  const q = parseQuery(req, z.object({ grade: z.coerce.number().int().min(6).max(9).optional() }));
  if ("error" in q) return q.error;
  return ok({ items: listSubjects(q.data.grade) });
}
