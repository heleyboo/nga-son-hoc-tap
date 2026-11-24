/**
 * Mã service worker (chạy trong trình duyệt, tách khỏi trang). Được phát ở /sw.js với
 * VERSION + danh sách tài nguyên chèn vào lúc chạy → mỗi lần deploy là một phiên bản mới.
 *
 * Nguyên tắc: KHÔNG BAO GIỜ lưu /api/* (điểm, đăng nhập, bảng xếp hạng) hay dữ liệu RSC.
 *   /_next/static/*         lưu lâu (tên file có mã băm, không đổi nội dung)
 *   /games/*                hỏi mạng trước (không quá 4 giây), mất mạng mới dùng bản đã lưu
 *   /icons/*, /fonts/*      dùng bản đã lưu, đồng thời tải bản mới ở nền
 *   trang (điều hướng)      luôn hỏi mạng trước; mất mạng → bản đã lưu → trang /offline
 */
export function swSource(version: string, precachePages: string[], precacheAssets: string[], cacheablePages: string[]) {
  return `/* Web Học Tập THCS Nga Sơn — service worker ${version} */
const VERSION = ${JSON.stringify(version)};
const PAGES = "pages-" + VERSION, STATIC = "static-v1", ASSETS = "assets-" + VERSION;
const PRECACHE_PAGES = ${JSON.stringify(precachePages)};
const PRECACHE_ASSETS = ${JSON.stringify(precacheAssets)};
const CACHEABLE = ${JSON.stringify(cacheablePages)};   // tiền tố đường dẫn trang được phép lưu

const isCacheablePage = (p) => CACHEABLE.some((c) => (c.endsWith("/") && c !== "/" ? p.startsWith(c) : p === c));

/** Lưu một trang + các file JS/CSS nó cần (để mở được khi mất mạng) */
async function cachePage(url) {
  const res = await fetch(url, { credentials: "same-origin", cache: "no-store" });
  if (!res.ok || !(res.headers.get("content-type") || "").includes("text/html")) return;
  const html = await res.clone().text();
  await (await caches.open(PAGES)).put(url, res);
  const deps = [...new Set([...html.matchAll(/(?:src|href)="(\\/_next\\/static\\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")))];
  const st = await caches.open(STATIC);
  await Promise.all(deps.map(async (d) => { if (!(await st.match(d))) { try { const r = await fetch(d); if (r.ok) await st.put(d, r); } catch {} } }));
}

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    // trang offline là bắt buộc; phần còn lại cố gắng hết sức (lỗi một file không làm hỏng cả bộ)
    await cachePage("/offline");
    const a = await caches.open(ASSETS);
    for (let i = 0; i < PRECACHE_ASSETS.length; i += 6) {
      await Promise.all(PRECACHE_ASSETS.slice(i, i + 6).map((u) => a.add(u).catch(() => {})));
    }
    for (const p of PRECACHE_PAGES) await cachePage(p).catch(() => {});
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== PAGES && k !== STATIC && k !== ASSETS) await caches.delete(k);
    // giữ kho file tĩnh gọn (tối đa ~400 file, bỏ file cũ nhất)
    const st = await caches.open(STATIC), keys = await st.keys();
    for (const k of keys.slice(0, Math.max(0, keys.length - 400))) await st.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const p = url.pathname;
  // dữ liệu động & luồng trực tiếp: luôn đi thẳng mạng
  if (p.startsWith("/api/") || p.startsWith("/_next/webpack-hmr") || p.startsWith("/_next/image") || p === "/sw.js") return;
  if (req.headers.get("RSC") || url.searchParams.has("_rsc") || req.headers.get("Next-Router-Prefetch")) return;

  if (p.startsWith("/_next/static/")) {
    e.respondWith((async () => {
      const st = await caches.open(STATIC);
      const hit = await st.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) st.put(req, res.clone());
      return res;
    })());
    return;
  }

  // trò chơi: hỏi mạng trước (deploy game mới là thấy ngay), chờ tối đa 4 giây; mất mạng → bản đã lưu
  if (p.startsWith("/games/")) {
    e.respondWith((async () => {
      const a = await caches.open(ASSETS);
      try {
        const res = await Promise.race([
          fetch(req, { cache: "no-cache" }),
          new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 4000)),
        ]);
        if (res.ok && res.status === 200) a.put(req, res.clone());
        return res;
      } catch {
        return (await a.match(req, { ignoreSearch: true })) || new Response("", { status: 504 });
      }
    })());
    return;
  }

  if (p.startsWith("/icons/") || p.startsWith("/fonts/")) {
    e.respondWith((async () => {
      const a = await caches.open(ASSETS);
      const hit = await a.match(req, { ignoreSearch: true });
      const net = fetch(req).then((res) => { if (res.ok && res.status === 200) a.put(req, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      return (await net) || new Response("", { status: 504 });
    })());
    return;
  }

  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok && isCacheablePage(p)) (await caches.open(PAGES)).put(p, res.clone());
        return res;
      } catch {
        const pages = await caches.open(PAGES);
        return (await pages.match(p)) || (await pages.match("/offline")) || new Response("Mất kết nối mạng", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
      }
    })());
  }
});
`;
}
