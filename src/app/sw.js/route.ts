import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { connection } from "next/server";
import { GAMES } from "@/lib/modules";
import { swSource } from "@/lib/pwa/sw-source";

/** Liệt kê file trò chơi để lưu sẵn (bỏ thư mục _backup, _preview và file giấy phép) */
function gameFiles(dir: string, base = "/games"): { url: string; sig: string }[] {
  const out: { url: string; sig: string }[] = [];
  let names: string[] = [];
  try { names = readdirSync(dir); } catch { return out; }
  for (const n of names) {
    if (n.startsWith("_") || n.startsWith(".")) continue;
    const full = path.join(dir, n);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...gameFiles(full, `${base}/${n}`));
    else if (!/\.(txt|md|map)$/i.test(n)) out.push({ url: `${base}/${encodeURIComponent(n)}`, sig: `${n}:${st.size}:${st.mtimeMs}` });
  }
  return out;
}

/** /sw.js — sinh lúc chạy để phiên bản đổi theo mỗi lần deploy (BUILD_ID + file trò chơi) */
export async function GET() {
  await connection();
  const root = process.cwd();
  const files = gameFiles(path.join(/*turbopackIgnore: true*/ root, "public", "games"));
  let build = "dev";
  try { build = readFileSync(path.join(/*turbopackIgnore: true*/ root, ".next", "BUILD_ID"), "utf8").trim(); } catch { /* chế độ dev */ }
  const version = createHash("sha1").update(build + files.map((f) => f.sig).join("|")).digest("hex").slice(0, 10);
  const icons = ["/icons/icon-192.png", "/icons/icon-512.png", "/icons/shortcut.png"];
  const gamePages = GAMES.map((g) => `/tro-choi/${g.slug}`);
  const body = swSource(version, ["/", ...gamePages], [...icons, ...files.map((f) => f.url)], ["/", "/offline", "/tro-choi/", "/cong-nghe", "/chinh-sach"]);
  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
