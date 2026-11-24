import { fail, ok, parseBody } from "@/lib/http";
import { createAssignment, listAssignments, requireTeacher } from "@/lib/teacher";
import { assignmentBody } from "@/lib/teacher-validation";

/** GET /api/teacher/assignments — danh sách bài giao kèm số bài nộp, điểm trung bình */
export async function GET(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  return ok({ items: listAssignments() }, { headers: { "Cache-Control": "no-store" } });
}

/** POST /api/teacher/assignments — tạo bài giao (chọn ngẫu nhiên câu hỏi theo cấu hình, cố định cho mọi học sinh) */
export async function POST(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const b = await parseBody(req, assignmentBody);
  if ("error" in b) return b.error;
  try {
    return ok(createAssignment(b.data, t.user.id), { status: 201 });
  } catch (e) {
    return fail(400, (e as Error).message);
  }
}
