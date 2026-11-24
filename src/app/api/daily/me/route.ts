import { getSessionUser } from "@/lib/auth";
import { gradeFromClass, myDaily, nextResetAt, vnDate } from "@/lib/daily";
import { ok } from "@/lib/http";

/** GET /api/daily/me — chuỗi ngày + lịch đã chơi (tài khoản), khối gợi ý, giờ đổi đề */
export async function GET(req: Request) {
  const me = await getSessionUser(req.headers).catch(() => null);
  return ok({
    today: vnDate(), resetAt: nextResetAt(), serverNow: Date.now(),
    signedIn: !!me, suggestedGrade: gradeFromClass(me?.className),
    stats: me ? myDaily(me.id) : null,
  }, { headers: { "Cache-Control": "no-store" } });
}
