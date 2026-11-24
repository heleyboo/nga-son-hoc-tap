import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { addFeedback, feedbackSummary } from "@/lib/quiz";
import { ok, parseBody, parseQuery } from "@/lib/http";
import { feedbackInput } from "@/lib/validation";

/** GET /api/feedback?limit=10 — điểm sao trung bình + nhận xét gần đây */
export async function GET(req: Request) {
  const q = parseQuery(req, z.object({ limit: z.coerce.number().int().min(1).max(50).default(10) }));
  if ("error" in q) return q.error;
  return ok(feedbackSummary(q.data.limit));
}

/** POST /api/feedback — nhận xét, đánh giá của người làm */
export async function POST(req: Request) {
  const body = await parseBody(req, feedbackInput);
  if ("error" in body) return body.error;
  const user = await getSessionUser(req.headers);
  return ok(addFeedback({ ...body.data, playerName: user?.nickname ?? body.data.playerName }), { status: 201 });
}
