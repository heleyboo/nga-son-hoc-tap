import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { dailyBoard, vnDate } from "@/lib/daily";
import { ok, parseQuery } from "@/lib/http";

/** GET /api/daily/board?grade=8[&date=YYYY-MM-DD] — bảng xếp hạng thử thách của một ngày */
export async function GET(req: Request) {
  const q = parseQuery(req, z.object({
    grade: z.coerce.number().int().min(6).max(9),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }));
  if ("error" in q) return q.error;
  const me = await getSessionUser(req.headers).catch(() => null);
  return ok(dailyBoard(q.data.grade, q.data.date ?? vnDate(), me?.id ?? null), { headers: { "Cache-Control": "no-store" } });
}
