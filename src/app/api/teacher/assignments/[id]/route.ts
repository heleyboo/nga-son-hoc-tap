import { fail, ok, parseBody } from "@/lib/http";
import { assignmentDetail, deleteAssignment, requireTeacher, updateAssignment } from "@/lib/teacher";
import { assignmentPatch } from "@/lib/teacher-validation";

type Ctx = RouteContext<"/api/teacher/assignments/[id]">;

/** GET /api/teacher/assignments/:id — chi tiết + bài nộp + tỉ lệ đúng từng câu */
export async function GET(req: Request, ctx: Ctx) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const d = assignmentDetail(Number((await ctx.params).id));
  return d ? ok(d, { headers: { "Cache-Control": "no-store" } }) : fail(404, "Không tìm thấy bài giao");
}

/** PATCH /api/teacher/assignments/:id — mở/đóng, đổi hạn, đổi tên */
export async function PATCH(req: Request, ctx: Ctx) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const b = await parseBody(req, assignmentPatch);
  if ("error" in b) return b.error;
  return updateAssignment(Number((await ctx.params).id), b.data) ? ok({ ok: true }) : fail(404, "Không tìm thấy bài giao");
}

/** DELETE /api/teacher/assignments/:id — xoá bài giao và toàn bộ bài nộp */
export async function DELETE(req: Request, ctx: Ctx) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  return deleteAssignment(Number((await ctx.params).id)) ? ok({ ok: true }) : fail(404, "Không tìm thấy bài giao");
}
