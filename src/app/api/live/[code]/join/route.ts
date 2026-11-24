import { fail, ok, parseBody } from "@/lib/http";
import { joinRoom, LiveError } from "@/lib/live/rooms";
import { joinInput, roomCode } from "@/lib/live/validation";

/** POST /api/live/:code/join — học sinh vào phòng (không cần đăng nhập) */
export async function POST(req: Request, ctx: RouteContext<"/api/live/[code]/join">) {
  const code = roomCode.safeParse((await ctx.params).code);
  if (!code.success) return fail(400, "Mã phòng gồm 6 chữ số");
  const body = await parseBody(req, joinInput);
  if ("error" in body) return body.error;
  try {
    return ok(joinRoom(code.data, body.data.name, body.data.className ?? null));
  } catch (e) {
    if (e instanceof LiveError) return fail(e.status, e.message);
    throw e;
  }
}
