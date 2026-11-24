import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { fail, ok, parseBody } from "@/lib/http";
import { publicOrigin, ShareError, shareArena, shareDaily } from "@/lib/share";

const body = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("daily"), runId: z.number().int(), token: z.string().min(1).max(80), name: z.string().max(40).optional().nullable() }),
  z.object({ kind: z.literal("arena"), attemptId: z.number().int() }),
]);

/** POST /api/share — tạo (hoặc lấy lại) thẻ thành tích, trả về đường dẫn chia sẻ + ảnh */
export async function POST(req: Request) {
  const b = await parseBody(req, body);
  if ("error" in b) return b.error;
  const me = await getSessionUser(req.headers).catch(() => null);
  try {
    const slug = b.data.kind === "daily" ? shareDaily(b.data.runId, b.data.token, b.data.name ?? null) : shareArena(b.data.attemptId, me);
    const origin = publicOrigin();
    return ok({ slug, url: `${origin}/chia-se/${slug}`, path: `/chia-se/${slug}`, image: `/api/share/${slug}/image` });
  } catch (e) {
    if (e instanceof ShareError) return fail(e.status, e.message);
    throw e;
  }
}
