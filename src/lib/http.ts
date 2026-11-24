import { z } from "zod";

export const ok = (data: unknown, init?: ResponseInit) => Response.json(data, init);

export const fail = (status: number, error: string, details?: unknown) =>
  Response.json({ error, details }, { status });

/** Đọc + validate body JSON; trả Response lỗi 400 nếu sai */
export async function parseBody<T extends z.ZodType>(
  req: Request,
  schema: T,
): Promise<{ data: z.infer<T> } | { error: Response }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { error: fail(400, "Body phải là JSON hợp lệ") };
  }
  const r = schema.safeParse(raw);
  if (!r.success) return { error: fail(400, "Dữ liệu không hợp lệ", z.treeifyError(r.error)) };
  return { data: r.data };
}

export function parseQuery<T extends z.ZodType>(req: Request, schema: T) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const r = schema.safeParse(params);
  return r.success
    ? ({ data: r.data as z.infer<T> } as const)
    : ({ error: fail(400, "Tham số không hợp lệ", z.treeifyError(r.error)) } as const);
}
