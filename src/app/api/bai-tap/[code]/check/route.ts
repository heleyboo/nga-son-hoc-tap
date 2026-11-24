import { fail, ok, parseBody } from "@/lib/http";
import { checkAssignmentAnswer } from "@/lib/assignment";
import { checkBody } from "@/lib/teacher-validation";

/** POST /api/bai-tap/:code/check — chỉ dùng cho bài chế độ luyện tập: xem đúng/sai + giải thích từng câu */
export async function POST(req: Request, ctx: RouteContext<"/api/bai-tap/[code]/check">) {
  const b = await parseBody(req, checkBody);
  if ("error" in b) return b.error;
  const r = checkAssignmentAnswer((await ctx.params).code, b.data.questionId, b.data.selectedIndex);
  return r ? ok(r) : fail(400, "Không kiểm tra được câu này");
}
