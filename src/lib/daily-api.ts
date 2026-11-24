import { z } from "zod";
import { fail } from "./http";
import { DailyError } from "./daily";

export const runRef = z.object({ runId: z.number().int(), token: z.string().min(1).max(80) });
export const answerBody = runRef.extend({ index: z.number().int().min(0).max(20), choice: z.number().int().min(0).max(9).nullable() });
export const startBody = z.object({ grade: z.number().int().min(6).max(9) });

export function dailyFail(e: unknown) {
  if (e instanceof DailyError) return fail(e.status, e.message);
  throw e;
}
