import { getSessionUser } from "@/lib/auth";
import { leaderboard } from "@/lib/quiz";
import { ok, parseQuery } from "@/lib/http";
import { leaderboardQuery } from "@/lib/validation";

/** GET /api/leaderboard?grade=8|all&level=basic|advanced|all&mode=arena|practice&period=week|month|all&limit=50 */
export async function GET(req: Request) {
  const q = parseQuery(req, leaderboardQuery);
  if ("error" in q) return q.error;
  const user = await getSessionUser(req.headers);
  return ok(leaderboard(q.data, user?.id), { headers: { "Cache-Control": "no-store" } });
}
