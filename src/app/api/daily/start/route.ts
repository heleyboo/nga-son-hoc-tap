import { getSessionUser } from "@/lib/auth";
import { startRun } from "@/lib/daily";
import { dailyFail, startBody } from "@/lib/daily-api";
import { ok, parseBody } from "@/lib/http";

/** POST /api/daily/start { grade } — bắt đầu/tiếp tục lượt thử thách hôm nay */
export async function POST(req: Request) {
  const b = await parseBody(req, startBody);
  if ("error" in b) return b.error;
  const me = await getSessionUser(req.headers).catch(() => null);
  try { return ok(startRun(b.data.grade, me)); } catch (e) { return dailyFail(e); }
}
