import { getSessionUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { ProgressError, recordGame } from "@/lib/progress";
import { normalizeResult } from "@/lib/progress-rules";

/** POST /api/games/result — ghi kết quả một lượt chơi trò chơi STEM (chỉ tài khoản đăng nhập) */
export async function POST(req: Request) {
  const me = await getSessionUser(req.headers).catch(() => null);
  if (!me) return fail(401, "Chưa đăng nhập");
  let raw: unknown;
  try { raw = await req.json(); } catch { return fail(400, "Body phải là JSON hợp lệ"); }
  const r = normalizeResult(raw);
  if (!r) return fail(400, "Kết quả không hợp lệ");
  try {
    return ok(recordGame(me.id, r));
  } catch (e) {
    if (e instanceof ProgressError) return fail(e.status, e.message);
    throw e;
  }
}
