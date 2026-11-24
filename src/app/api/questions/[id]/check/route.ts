import { checkAnswer } from "@/lib/quiz";
import { fail, ok, parseBody } from "@/lib/http";
import { checkInput } from "@/lib/validation";

/** POST /api/questions/:id/check { selectedIndex } — chấm 1 câu (chế độ Luyện tập) */
export async function POST(req: Request, ctx: RouteContext<"/api/questions/[id]/check">) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) return fail(400, "id không hợp lệ");
  const body = await parseBody(req, checkInput);
  if ("error" in body) return body.error;
  const r = checkAnswer(id, body.data.selectedIndex);
  return r ? ok(r) : fail(404, "Không tìm thấy câu hỏi");
}
