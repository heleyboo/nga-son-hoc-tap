import { connection } from "next/server";
import { ok } from "@/lib/http";

/** GET /api/live/origin — địa chỉ công khai để in vào mã QR (cấu hình LIVE_PUBLIC_URL) */
export async function GET() {
  await connection();
  const url = process.env.LIVE_PUBLIC_URL?.replace(/\/+$/, "") || null;
  return ok({ url });
}
