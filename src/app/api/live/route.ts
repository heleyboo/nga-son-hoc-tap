import { getSessionUser } from "@/lib/auth";
import { fail, ok, parseBody } from "@/lib/http";
import { createRoom, LiveError } from "@/lib/live/rooms";
import { createRoomInput } from "@/lib/live/validation";

/** POST /api/live — giáo viên tạo phòng. Trả về mã phòng + khoá điều khiển (chỉ người tạo giữ). */
export async function POST(req: Request) {
  const body = await parseBody(req, createRoomInput);
  if ("error" in body) return body.error;
  try {
    const u = await getSessionUser(req.headers).catch(() => null);
    return ok(createRoom(body.data, u?.id ?? null), { status: 201 });
  } catch (e) {
    if (e instanceof LiveError) return fail(e.status, e.message);
    throw e;
  }
}
