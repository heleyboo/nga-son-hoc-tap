import { ok, parseBody } from "@/lib/http";
import { importQuestions, requireTeacher } from "@/lib/teacher";
import { importBody } from "@/lib/teacher-validation";

/** POST /api/teacher/questions/import { csv, dryRun } — dryRun = chỉ kiểm tra, chưa ghi */
export async function POST(req: Request) {
  const t = await requireTeacher(req.headers);
  if ("error" in t) return t.error;
  const b = await parseBody(req, importBody);
  if ("error" in b) return b.error;
  return ok(importQuestions(b.data.csv, b.data.dryRun));
}
