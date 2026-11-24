import QRCode from "qrcode";
import { fail } from "@/lib/http";

/** GET /api/live/qr?url=… — ảnh QR (SVG) của đường dẫn vào phòng */
export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url") ?? "";
  if (!/^https?:\/\//.test(url) || url.length > 300) return fail(400, "Đường dẫn không hợp lệ");
  const svg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0c4a6e", light: "#ffffff" } });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" } });
}
