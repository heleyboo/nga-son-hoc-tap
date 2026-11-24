import { ok } from "@/lib/http";
import { listFeedback, requireTeacher } from "@/lib/teacher";

/** GET /api/teacher/feedback — góp ý của học sinh (mới nhất trước) */
export async function GET(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  return ok({ items: listFeedback() }, { headers: { "Cache-Control": "no-store" } });
}
