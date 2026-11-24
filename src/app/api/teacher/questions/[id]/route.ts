import { fail, ok, parseBody } from "@/lib/http";
import { requireTeacher, updateQuestion } from "@/lib/teacher";
import { questionBody, questionPatch } from "@/lib/teacher-validation";

/** PUT /api/teacher/questions/:id — sửa toàn bộ câu hỏi */
export async function PUT(req: Request, ctx: RouteContext<"/api/teacher/questions/[id]">) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const id = Number((await ctx.params).id);
  const b = await parseBody(req, questionBody);
  if ("error" in b) return b.error;
  try {
    return updateQuestion(id, b.data) ? ok({ ok: true }) : fail(404, "Không tìm thấy câu hỏi");
  } catch (e) {
    if (String(e).includes("UNIQUE")) return fail(409, "Mã câu hỏi đã tồn tại");
    throw e;
  }
}

/** PATCH /api/teacher/questions/:id — ẩn/hiện, duyệt giải thích */
export async function PATCH(req: Request, ctx: RouteContext<"/api/teacher/questions/[id]">) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const id = Number((await ctx.params).id);
  const b = await parseBody(req, questionPatch);
  if ("error" in b) return b.error;
  return updateQuestion(id, b.data) ? ok({ ok: true }) : fail(404, "Không tìm thấy câu hỏi");
}
