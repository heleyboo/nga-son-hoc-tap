import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { fail, ok, parseQuery } from "@/lib/http";
import { gameBoard } from "@/lib/progress";
import { GAME_RULES } from "@/lib/progress-rules";

const q = z.object({
  game: z.enum(["chien-co", "quy-dao", "tau-ngam"]),
  total: z.coerce.number().int(),
  period: z.enum(["week", "month", "all"]).default("all"),
});

/** GET /api/leaderboard/games?game=chien-co&total=10&period=all — kỷ lục trò chơi có điểm */
export async function GET(req: Request) {
  const p = parseQuery(req, q);
  if ("error" in p) return p.error;
  if (!GAME_RULES[p.data.game].modes.includes(p.data.total)) return fail(400, "Chế độ không hợp lệ");
  const me = await getSessionUser(req.headers).catch(() => null);
  return ok(gameBoard(p.data.game, p.data.total, p.data.period, me?.id), { headers: { "Cache-Control": "no-store" } });
}
