import { ok } from "@/lib/http";
import { listLiveSessions, requireTeacher } from "@/lib/teacher";

/** GET /api/teacher/live-sessions — kết quả các buổi "Lớp học trực tiếp" đã kết thúc */
export async function GET(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  return ok({ items: listLiveSessions() }, { headers: { "Cache-Control": "no-store" } });
}
