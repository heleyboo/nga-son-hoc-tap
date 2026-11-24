import { fail, ok } from "@/lib/http";
import { getAssignmentPublic } from "@/lib/assignment";

/** GET /api/bai-tap/:code — đề bài cho học sinh (không kèm đáp án) */
export async function GET(_req: Request, ctx: RouteContext<"/api/bai-tap/[code]">) {
  const a = getAssignmentPublic((await ctx.params).code);
  return a ? ok(a, { headers: { "Cache-Control": "no-store" } }) : fail(404, "Không tìm thấy bài tập — kiểm tra lại mã");
}
