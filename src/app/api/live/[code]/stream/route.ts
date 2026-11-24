import { fail } from "@/lib/http";
import { LiveError, subscribe } from "@/lib/live/rooms";
import type { LiveView } from "@/lib/live/types";
import { roomCode } from "@/lib/live/validation";

/**
 * GET /api/live/:code/stream?key=…            (màn hình giáo viên)
 * GET /api/live/:code/stream?pid=…&token=…    (điện thoại học sinh)
 * Server-Sent Events: mỗi lần trạng thái phòng đổi, gửi trọn "view" của vai trò đó.
 */
export async function GET(req: Request, ctx: RouteContext<"/api/live/[code]/stream">) {
  const code = roomCode.safeParse((await ctx.params).code);
  if (!code.success) return fail(400, "Mã phòng gồm 6 chữ số");
  const sp = new URL(req.url).searchParams;
  const key = sp.get("key"), pid = sp.get("pid"), tok = sp.get("token");
  const who = key ? { role: "host" as const, key } : pid && tok ? { role: "player" as const, id: pid, token: tok } : null;
  if (!who) return fail(400, "Thiếu thông tin kết nối");

  const enc = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let ping: ReturnType<typeof setInterval> | null = null;
  const cleanup = () => {
    if (ping) clearInterval(ping);
    ping = null;
    unsubscribe?.();
    unsubscribe = null;
  };

  // Kiểm tra quyền trước khi mở stream để trả mã lỗi HTTP đúng
  let first: LiveView | null = null;
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;
  const send = (v: LiveView) => {
    if (!controllerRef) { first = v; return; }
    try { controllerRef.enqueue(enc.encode(`data: ${JSON.stringify(v)}\n\n`)); } catch { cleanup(); }
  };
  try {
    unsubscribe = subscribe(code.data, who, send);
  } catch (e) {
    if (e instanceof LiveError) return fail(e.status, e.message);
    throw e;
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controllerRef = controller;
      controller.enqueue(enc.encode("retry: 2000\n\n"));
      if (first) send(first);
      // giữ kết nối qua proxy/Wi-Fi trường
      ping = setInterval(() => {
        try { controller.enqueue(enc.encode(": ping\n\n")); } catch { cleanup(); }
      }, 15000);
      req.signal.addEventListener("abort", () => {
        cleanup();
        try { controller.close(); } catch { /* đã đóng */ }
      });
    },
    cancel: cleanup,
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
