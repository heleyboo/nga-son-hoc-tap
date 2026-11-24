import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { fail } from "@/lib/http";
import { getShare } from "@/lib/share";

// font có đủ dấu tiếng Việt (public/fonts, OFL) — đọc một lần
const fonts = Promise.all([
  readFile(join(process.cwd(), "public/fonts/NotoSans-Regular.ttf")),
  readFile(join(process.cwd(), "public/fonts/NotoSans-Bold.ttf")),
]);

const THEMES = {
  daily: { from: "#b45309", mid: "#d97706", to: "#059669", accent: "#fde68a" },
  arena: { from: "#0369a1", mid: "#0284c7", to: "#059669", accent: "#bae6fd" },
} as const;

/** GET /api/share/:slug/image — ảnh thẻ thành tích 1200×630 (dùng làm ảnh xem trước Zalo/Facebook và để tải về) */
export async function GET(req: Request, ctx: RouteContext<"/api/share/[slug]/image">) {
  const s = getShare((await ctx.params).slug);
  if (!s) return fail(404, "Không tìm thấy thẻ");
  const c = s.card;
  const t = THEMES[s.kind];
  const [regular, bold] = await fonts;
  const download = new URL(req.url).searchParams.has("tai");
  const res = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Noto Sans", color: "#fff",
        background: `linear-gradient(125deg, ${t.from} 0%, ${t.mid} 45%, ${t.to} 100%)` }}>
        {/* vòng trang trí */}
        <div style={{ position: "absolute", right: -120, top: -160, width: 520, height: 520, borderRadius: 999, background: "rgba(255,255,255,.10)", display: "flex" }} />
        <div style={{ position: "absolute", left: -90, bottom: -170, width: 380, height: 380, borderRadius: 999, border: "36px solid rgba(255,255,255,.10)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "56px 70px", width: "100%", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700 }}>NS</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>WEB HỌC TẬP THCS NGA SƠN</div>
              <div style={{ display: "flex", fontSize: 20, opacity: 0.85 }}>{`${c.title} · ${c.subtitle}`}</div>
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
              <div style={{ fontSize: 30, opacity: 0.9 }}>Chúc mừng</div>
              <div style={{ fontSize: c.name.length > 16 ? 58 : 72, fontWeight: 700, lineHeight: 1.1 }}>{c.name}</div>
              {c.className ? <div style={{ display: "flex", fontSize: 28, opacity: 0.85, marginTop: 6 }}>{`Lớp ${c.className}`}</div> : null}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                {c.chips.map((x) => (
                  <div key={x} style={{ display: "flex", padding: "10px 20px", borderRadius: 999, background: "rgba(255,255,255,.2)", border: "2px solid rgba(255,255,255,.35)", fontSize: 24, fontWeight: 700 }}>{x}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 330, height: 330, borderRadius: 999,
              background: "rgba(255,255,255,.95)", color: t.from, boxShadow: "0 30px 60px rgba(0,0,0,.25)" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#475569" }}>ĐIỂM</div>
              <div style={{ fontSize: c.score >= 1000 ? 104 : 124, fontWeight: 700, lineHeight: 1 }}>{c.score.toLocaleString("vi-VN")}</div>
              <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: t.to, marginTop: 8 }}>{`${c.correct}/${c.total} câu đúng`}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
            <div style={{ display: "flex", color: t.accent, fontWeight: 700 }}>Bạn có làm tốt hơn không? Thử sức ngay!</div>
            <div style={{ display: "flex", opacity: 0.8 }}>Sản phẩm STEM · Trường THCS Nga Sơn</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200, height: 630,
      fonts: [
        { name: "Noto Sans", data: regular, weight: 400, style: "normal" },
        { name: "Noto Sans", data: bold, weight: 700, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=300",
        ...(download ? { "Content-Disposition": `attachment; filename="thanh-tich-${s.slug}.png"` } : {}),
      },
    },
  );
  return res;
}
