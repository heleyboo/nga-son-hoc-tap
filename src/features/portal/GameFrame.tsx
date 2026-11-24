"use client";
import { ChevronLeft, ChevronRight, ExternalLink, House, Loader2, Maximize2, Minimize2, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { GAMES, gameBySlug, type GameSlug } from "@/lib/modules";
import { useIsClient } from "@/features/arena/lib/client";
import { GAME_ICONS } from "./gameIcons";
import { recordGameResult, type RecordOutcome } from "@/features/progress/store";
import { normalizeResult } from "@/lib/progress-rules";

const subscribeFs = (cb: () => void) => {
  document.addEventListener("fullscreenchange", cb);
  return () => document.removeEventListener("fullscreenchange", cb);
};

/**
 * Khung chơi game: thanh điều hướng mỏng + iframe chiếm phần còn lại của màn hình.
 * Game gốc là trang HTML tĩnh (public/games), cùng nguồn nên âm thanh/bàn phím hoạt động bình thường.
 */
export function GameFrame({ slug }: { slug: GameSlug }) {
  const g = gameBySlug(slug)!;
  const Icon = GAME_ICONS[slug];
  const i = GAMES.findIndex((x) => x.slug === slug);
  const prev = GAMES[(i + GAMES.length - 1) % GAMES.length];
  const next = GAMES[(i + 1) % GAMES.length];

  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const loaded = loadedSlug === slug;
  // Chỉ gắn iframe sau hydrate, nếu không trang game có thể tải xong trước khi React gắn onLoad
  const isClient = useIsClient();
  const isFs = useSyncExternalStore(subscribeFs, () => !!document.fullscreenElement, () => false);
  const fsSupported = useSyncExternalStore(() => () => {}, () => !!document.fullscreenEnabled, () => false);

  const toggleFs = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await wrap.current?.requestFullscreen();
    } catch { /* trình duyệt không cho phép — bỏ qua */ }
    frame.current?.contentWindow?.focus();
  };

  // Phím F để bật/tắt toàn màn hình khi focus đang ở thanh điều hướng
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f" && !(e.target as HTMLElement).closest("input, textarea")) void toggleFs();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Kết quả do game gửi lên (public/games/ket-qua.js): chỉ nhận từ đúng iframe của trang, cùng tên miền
  const [outcome, setOutcome] = useState<(RecordOutcome & { id: number }) | null>(null);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.source !== frame.current?.contentWindow) return;
      if ((e.data as { type?: string })?.type !== "nsgame:result") return;
      const r = normalizeResult(e.data);
      if (!r || r.game !== slug) return;
      void recordGameResult(r).then((o) => setOutcome({ ...o, id: Date.now() }));
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [slug]);
  useEffect(() => {
    if (!outcome) return;
    const t = window.setTimeout(() => setOutcome(null), 9000);
    return () => window.clearTimeout(t);
  }, [outcome]);

  const btn = "inline-grid place-items-center size-11 rounded-2xl bg-white/15 border border-white/25 text-white hover:bg-white/25 transition";

  return (
    <div ref={wrap} className="fixed inset-0 flex flex-col bg-slate-950">
      <header className="shrink-0 flex items-center gap-2 px-2 sm:px-3 py-1.5 text-white pt-[max(6px,env(safe-area-inset-top))]"
        style={{ background: `linear-gradient(100deg, ${g.from}, ${g.to})` }}>
        <Link href="/#tro-choi" className={btn} aria-label="Về trang chủ" title="Về trang chủ"><House className="size-5" aria-hidden /></Link>
        <div className="flex items-center gap-2 min-w-0 flex-1 px-1">
          <span className="grid place-items-center size-9 rounded-xl bg-white/20 shrink-0"><Icon className="size-5" aria-hidden /></span>
          <div className="min-w-0 leading-tight">
            <h1 className="font-black truncate text-[clamp(.9rem,.85rem+.3vw,1.15rem)]">{g.title}</h1>
            <p className="text-[11px] sm:text-xs text-white/80 font-semibold truncate">Phân hệ {g.no} · {g.topics}</p>
          </div>
        </div>
        <nav aria-label="Chuyển trò chơi" className="flex items-center gap-1.5">
          <Link href={`/tro-choi/${prev.slug}`} className={`${btn} max-sm:hidden`} aria-label={`Trò trước: ${prev.title}`} title={prev.title}><ChevronLeft className="size-5" aria-hidden /></Link>
          <Link href={`/tro-choi/${next.slug}`} className={`${btn} max-sm:hidden`} aria-label={`Trò tiếp: ${next.title}`} title={next.title}><ChevronRight className="size-5" aria-hidden /></Link>
          {fsSupported
            ? <button onClick={() => void toggleFs()} className={btn} aria-label={isFs ? "Thoát toàn màn hình" : "Toàn màn hình (F)"} title={isFs ? "Thoát toàn màn hình" : "Toàn màn hình (F)"}>
                {isFs ? <Minimize2 className="size-5" aria-hidden /> : <Maximize2 className="size-5" aria-hidden />}
              </button>
            : <a href={g.file} target="_blank" rel="noopener" className={btn} aria-label="Mở riêng trong tab mới" title="Mở riêng trong tab mới"><ExternalLink className="size-5" aria-hidden /></a>}
        </nav>
      </header>

      <div className="relative flex-1 min-h-0">
        {isClient && <iframe
          key={slug}
          ref={frame}
          src={g.file}
          title={g.title}
          allow="fullscreen; autoplay"
          className="absolute inset-0 size-full border-0 bg-slate-950"
          onLoad={() => { setLoadedSlug(slug); frame.current?.contentWindow?.focus(); }}
        />}
        {outcome && <ResultToast o={outcome} onClose={() => setOutcome(null)} />}
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} role="status">
            <div className="text-center">
              <Icon className="size-14 mx-auto mb-3 opacity-90" strokeWidth={1.6} aria-hidden />
              <p className="font-black text-xl">{g.title}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-white/85 font-semibold"><Loader2 className="size-4 animate-spin" aria-hidden /> Đang tải trò chơi…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Thông báo nhỏ ở góc trên sau khi chơi xong: +XP, cấp độ, nơi lưu */
function ResultToast({ o, onClose }: { o: RecordOutcome; onClose: () => void }) {
  return (
    <div role="status" className="absolute z-20 top-2 left-1/2 -translate-x-1/2 w-[min(94vw,440px)] rounded-2xl bg-white/95 text-slate-900 shadow-2xl px-4 py-3 flex items-start gap-3 backdrop-blur">
      <span className="grid place-items-center size-10 rounded-xl bg-amber-100 text-amber-600 shrink-0"><Sparkles className="size-5" aria-hidden /></span>
      <div className="flex-1 min-w-0 text-sm">
        {o.saved === "none" ? (
          <p className="font-bold text-slate-700">Kết quả lượt này không được ghi: {o.reason}.</p>
        ) : (
          <>
            <p className="font-black text-base">{o.capped ? "Đã ghi kết quả lượt chơi" : `+${o.xp} Điểm Tri Thức`}</p>
            <p className="text-slate-600 font-semibold">
              Cấp {o.rank.level} · {o.rank.name}
              {o.capped && <> · Hôm nay trò này đã đủ lượt được cộng điểm, hãy thử Đấu Trường nhé!</>}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {o.saved === "account" ? "Đã lưu vào tài khoản. " : "Đã lưu trên máy này. Đăng nhập Google để giữ thành tích khi đổi máy. "}
              <Link href="/ho-so" className="font-bold text-sky-700 underline">Xem hồ sơ</Link>
            </p>
          </>
        )}
      </div>
      <button onClick={onClose} aria-label="Đóng thông báo" className="grid place-items-center size-8 rounded-lg hover:bg-slate-100 shrink-0"><X className="size-4" aria-hidden /></button>
    </div>
  );
}

