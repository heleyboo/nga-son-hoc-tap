import { fail, ok, parseBody } from "@/lib/http";
import { hostAction, LiveError } from "@/lib/live/rooms";
import { hostInput, roomCode } from "@/lib/live/validation";

/** POST /api/live/:code/host — giáo viên điều khiển: start | reveal | leaderboard | next | end | kick */
export async function POST(req: Request, ctx: RouteContext<"/api/live/[code]/host">) {
  const code = roomCode.safeParse((await ctx.params).code);
  if (!code.success) return fail(400, "Mã phòng gồm 6 chữ số");
  const body = await parseBody(req, hostInput);
  if ("error" in body) return body.error;
  try {
    return ok(hostAction(code.data, body.data.key, body.data.action, body.data.playerId));
  } catch (e) {
    if (e instanceof LiveError) return fail(e.status, e.message);
    throw e;
  }
}
