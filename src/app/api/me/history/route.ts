import { getSessionUser } from "@/lib/auth";
import { myHistory } from "@/lib/quiz";
import { fail, ok } from "@/lib/http";

/** GET /api/me/history — các lượt chơi của tài khoản đang đăng nhập (đồng bộ giữa các thiết bị) */
export async function GET(req: Request) {
  const user = await getSessionUser(req.headers);
  if (!user) return fail(401, "Cần đăng nhập");
  return ok({ items: myHistory(user.id) }, { headers: { "Cache-Control": "no-store" } });
}
