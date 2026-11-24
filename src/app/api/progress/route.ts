import { getSessionUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { myProgress } from "@/lib/progress";

/** GET /api/progress — XP, cấp độ, chuỗi ngày, thành tích trò chơi của tài khoản đang đăng nhập */
export async function GET(req: Request) {
  const me = await getSessionUser(req.headers).catch(() => null);
  if (!me) return fail(401, "Chưa đăng nhập");
  return ok(myProgress(me.id), { headers: { "Cache-Control": "no-store" } });
}
