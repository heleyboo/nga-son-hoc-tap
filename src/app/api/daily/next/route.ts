import { nextQuestion } from "@/lib/daily";
import { dailyFail, runRef } from "@/lib/daily-api";
import { ok, parseBody } from "@/lib/http";

/** POST /api/daily/next — mở câu kế tiếp, server bắt đầu tính giờ */
export async function POST(req: Request) {
  const b = await parseBody(req, runRef);
  if ("error" in b) return b.error;
  try { return ok(nextQuestion(b.data.runId, b.data.token)); } catch (e) { return dailyFail(e); }
}
