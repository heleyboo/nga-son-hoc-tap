import { ok } from "@/lib/http";
import { overview, requireTeacher } from "@/lib/teacher";

/** GET /api/teacher/overview — số liệu tổng quan cho trang giáo viên */
export async function GET(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  return ok(overview(), { headers: { "Cache-Control": "no-store" } });
}
