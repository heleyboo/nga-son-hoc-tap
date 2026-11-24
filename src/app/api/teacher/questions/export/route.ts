import { parseQuery } from "@/lib/http";
import { questionsToCsv, requireTeacher } from "@/lib/teacher";
import { questionFilter } from "@/lib/teacher-validation";

/** GET /api/teacher/questions/export — tải CSV (mở bằng Excel) theo bộ lọc hiện tại */
export async function GET(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const q = parseQuery(req, questionFilter);
  if ("error" in q) return q.error;
  return new Response(questionsToCsv(q.data), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ngan-hang-cau-hoi.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
