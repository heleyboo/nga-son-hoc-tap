import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { user as userTable } from "@/db/schema";
import { getSessionUser, googleEnabled } from "@/lib/auth";
import { fail, ok, parseBody } from "@/lib/http";
import { meUpdate } from "@/lib/validation";

/** GET /api/me — người dùng hiện tại (hoặc null) + đăng nhập Google đã được cấu hình chưa */
export async function GET(req: Request) {
  const user = await getSessionUser(req.headers);
  return ok({ user, googleEnabled: googleEnabled() }, { headers: { "Cache-Control": "no-store" } });
}

/** PATCH /api/me { nickname, className? } — đổi tên hiển thị trên bảng xếp hạng, lớp */
export async function PATCH(req: Request) {
  const user = await getSessionUser(req.headers);
  if (!user) return fail(401, "Cần đăng nhập");
  const body = await parseBody(req, meUpdate);
  if ("error" in body) return body.error;
  getDb()
    .update(userTable)
    .set({ nickname: body.data.nickname, ...(body.data.className !== undefined ? { className: body.data.className || null } : {}) })
    .where(eq(userTable.id, user.id))
    .run();
  return ok({ user: await getSessionUser(req.headers) });
}
