import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { ok, parseQuery } from "@/lib/http";
import { xpBoard } from "@/lib/progress";

const q = z.object({ period: z.enum(["week", "month", "all"]).default("week") });

/** GET /api/leaderboard/xp?period=week|month|all — xếp hạng Điểm Tri Thức (XP) */
export async function GET(req: Request) {
  const p = parseQuery(req, q);
  if ("error" in p) return p.error;
  const me = await getSessionUser(req.headers).catch(() => null);
  return ok(xpBoard(p.data.period, me?.id), { headers: { "Cache-Control": "no-store" } });
}
