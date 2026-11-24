import { z } from "zod";
import { ok, parseBody, parseQuery } from "@/lib/http";
import { listReports, requireTeacher, setReportStatus } from "@/lib/teacher";
import { reportPatch } from "@/lib/teacher-validation";

/** GET /api/teacher/reports?status=open — các báo lỗi câu hỏi */
export async function GET(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const q = parseQuery(req, z.object({ status: z.enum(["open", "resolved", "rejected"]).default("open") }));
  if ("error" in q) return q.error;
  return ok({ items: listReports(q.data.status) }, { headers: { "Cache-Control": "no-store" } });
}

/** PATCH /api/teacher/reports { ids, status } */
export async function PATCH(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const b = await parseBody(req, reportPatch);
  if ("error" in b) return b.error;
  return ok({ changed: setReportStatus(b.data.ids, b.data.status) });
}
