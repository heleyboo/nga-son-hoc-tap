import { fail, ok, parseBody, parseQuery } from "@/lib/http";
import { createQuestion, listQuestions, requireTeacher } from "@/lib/teacher";
import { questionBody, questionFilter } from "@/lib/teacher-validation";

/** GET /api/teacher/questions — danh sách có lọc + phân trang (kèm đáp án) */
export async function GET(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const q = parseQuery(req, questionFilter);
  if ("error" in q) return q.error;
  return ok(listQuestions(q.data), { headers: { "Cache-Control": "no-store" } });
}

/** POST /api/teacher/questions — thêm câu hỏi (mã tự sinh nếu để trống) */
export async function POST(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const b = await parseBody(req, questionBody);
  if ("error" in b) return b.error;
  try {
    return ok(createQuestion(b.data), { status: 201 });
  } catch (e) {
    if (String(e).includes("UNIQUE")) return fail(409, "Mã câu hỏi đã tồn tại");
    throw e;
  }
}
