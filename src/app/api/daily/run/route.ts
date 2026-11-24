import { getRun } from "@/lib/daily";
import { dailyFail, runRef } from "@/lib/daily-api";
import { ok, parseQuery } from "@/lib/http";
import { z } from "zod";

/** GET /api/daily/run?runId=&token= — trạng thái lượt chơi (để tải lại trang vẫn tiếp tục được) */
export async function GET(req: Request) {
  const q = parseQuery(req, runRef.extend({ runId: z.coerce.number().int() }));
  if ("error" in q) return q.error;
  try { return ok(getRun(q.data.runId, q.data.token), { headers: { "Cache-Control": "no-store" } }); } catch (e) { return dailyFail(e); }
}
