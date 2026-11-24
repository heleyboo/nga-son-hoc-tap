import { answerQuestion } from "@/lib/daily";
import { answerBody, dailyFail } from "@/lib/daily-api";
import { ok, parseBody } from "@/lib/http";

/** POST /api/daily/answer { runId, token, index, choice } — server chấm, tính giờ, cộng điểm */
export async function POST(req: Request) {
  const b = await parseBody(req, answerBody);
  if ("error" in b) return b.error;
  const d = b.data;
  try { return ok(answerQuestion(d.runId, d.token, d.index, d.choice)); } catch (e) { return dailyFail(e); }
}
