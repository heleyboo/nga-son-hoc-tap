import { reportQuestion } from "@/lib/quiz";
import { fail, ok, parseBody } from "@/lib/http";
import { reportInput } from "@/lib/validation";

/** POST /api/questions/:id/report { reason, note?, attemptId? } — báo lỗi câu hỏi 🚩 */
export async function POST(req: Request, ctx: RouteContext<"/api/questions/[id]/report">) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) return fail(400, "id không hợp lệ");
  const body = await parseBody(req, reportInput);
  if ("error" in body) return body.error;
  const r = reportQuestion(id, body.data);
  return r ? ok(r, { status: 201 }) : fail(404, "Không tìm thấy câu hỏi");
}
