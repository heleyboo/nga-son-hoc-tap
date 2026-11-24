import type { Metadata } from "next";
import Link from "next/link";
import { GAMES } from "@/lib/modules";

export const metadata: Metadata = { title: "Mất kết nối mạng", robots: { index: false } };

/** Trang hiện khi mất mạng mà trang cần mở chưa được lưu sẵn (service worker trả về) */
export default function OfflinePage() {
  return (
    <main className="min-h-dvh grid place-items-center p-5 bg-[linear-gradient(160deg,#e0f2fe,#ecfdf5)]">
      <div className="w-full max-w-lg rounded-[28px] bg-white/90 p-6 sm:p-8 shadow-[0_30px_60px_-30px_rgba(2,132,199,.5)] text-center">
        <p className="text-6xl" aria-hidden>📡</p>
        <h1 className="mt-3 font-black text-2xl text-ink">Đang mất kết nối mạng</h1>
        <p className="mt-2 text-ink-2">Trang này cần Internet. Trong lúc chờ, em vẫn chơi được các trò chơi STEM đã tải về máy:</p>
        <ul className="mt-5 grid gap-2 text-left">
          {GAMES.map((g) => (
            <li key={g.slug}>
              <Link href={`/tro-choi/${g.slug}`} prefetch={false} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white font-extrabold min-h-12" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}>
                <span className="text-sm opacity-80">{g.no}</span> {g.title}
              </Link>
            </li>
          ))}
        </ul>
        {/* cố ý tải lại toàn trang (không dùng Link): cần hỏi mạng thật */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="mt-5 inline-flex min-h-12 items-center px-6 rounded-2xl bg-sky-600 text-white font-extrabold">Thử tải lại trang chủ</a>
      </div>
    </main>
  );
}
