import { getSessionUser } from "@/lib/auth";
import { AssignmentError, submitAssignment } from "@/lib/assignment";
import { fail, ok, parseBody } from "@/lib/http";
import { submitBody } from "@/lib/teacher-validation";

/** POST /api/bai-tap/:code/submit — nộp bài, server chấm (thang 10) và trả về đáp án + giải thích */
export async function POST(req: Request, ctx: RouteContext<"/api/bai-tap/[code]/submit">) {
  const b = await parseBody(req, submitBody);
  if ("error" in b) return b.error;
  const user = await getSessionUser(req.headers).catch(() => null);
  try {
    return ok(submitAssignment((await ctx.params).code, b.data, user));
  } catch (e) {
    if (e instanceof AssignmentError) return fail(e.status, e.message);
    throw e;
  }
}
