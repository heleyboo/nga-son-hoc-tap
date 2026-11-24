import { getSessionUser } from "@/lib/auth";
import { submitAttempt } from "@/lib/quiz";
import { fail, ok, parseBody } from "@/lib/http";
import { attemptInput } from "@/lib/validation";

/**
 * POST /api/attempts — nộp bài; server tự chấm (không tin điểm client), lưu và trả nhận xét tự động.
 * Đã đăng nhập Google: gắn lượt chơi vào tài khoản và trả hạng tuần này.
 */
export async function POST(req: Request) {
  const body = await parseBody(req, attemptInput);
  if ("error" in body) return body.error;
  try {
    const user = await getSessionUser(req.headers);
    return ok(submitAttempt(body.data, user), { status: 201 });
  } catch (e) {
    return fail(400, e instanceof Error ? e.message : "Không nộp được bài");
  }
}
