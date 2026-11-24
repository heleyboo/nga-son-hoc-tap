import { fail, ok, parseBody } from "@/lib/http";
import { LiveError, submitAnswer } from "@/lib/live/rooms";
import { answerInput, roomCode } from "@/lib/live/validation";

/** POST /api/live/:code/answer — học sinh chọn đáp án (server tự bấm giờ và chấm) */
export async function POST(req: Request, ctx: RouteContext<"/api/live/[code]/answer">) {
  const code = roomCode.safeParse((await ctx.params).code);
  if (!code.success) return fail(400, "Mã phòng gồm 6 chữ số");
  const body = await parseBody(req, answerInput);
  if ("error" in body) return body.error;
  const b = body.data;
  try {
    return ok(submitAnswer(code.data, b.playerId, b.token, b.qIndex, b.choice));
  } catch (e) {
    if (e instanceof LiveError) return fail(e.status, e.message);
    throw e;
  }
}
