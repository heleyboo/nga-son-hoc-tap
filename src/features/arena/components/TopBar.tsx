import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, House, LogIn, LogOut, Medal, MessageSquareHeart, School, Star, Trophy as TrophyIcon, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../lib/session";
import { useProgress } from "@/features/progress/store";
import { SoundToggle } from "./SoundToggle";
import { IconButton, cx } from "./ui";

const linkBtn =
  "inline-grid place-items-center size-11 sm:size-12 shrink-0 rounded-2xl bg-white/80 text-deep border border-white shadow-[0_6px_16px_-10px_rgba(2,132,199,.5)] hover:bg-white transition";

/**
 * Thanh trên cùng. Trong ứng dụng chơi, các nút gọi callback (chuyển màn không tải lại);
 * ở trang khác (bảng xếp hạng) thì dùng liên kết.
 */
export function TopBar({ player, onHome, onAchievements, onFeedback, active, brand }: {
  player?: string; onHome?: () => void; onAchievements?: () => void; onFeedback?: () => void; active?: "leaderboard" | "portal";
  /** đổi thương hiệu bên trái (vd trang chủ cổng) */
  brand?: { title: string; subtitle: string; href: string };
}) {
  const { me, ready, googleEnabled, signIn, signOut } = useSession();
  const shownName = me?.nickname ?? player;

  const brandEl = (
    <>
      <span className="grid place-items-center size-10 rounded-[14px] shrink-0 btn-primary !shadow-none">
        {brand ? <School className="size-5" strokeWidth={2.5} aria-hidden /> : <TrophyIcon className="size-5" strokeWidth={2.5} aria-hidden />}
      </span>
      <span className="text-left leading-tight min-w-0">
        <span className="block font-black text-[clamp(.82rem,.75rem+.35vw,1.1rem)] tracking-tight text-deep truncate">{brand?.title ?? "ĐẤU TRƯỜNG TRI THỨC"}</span>
        <span className="block text-[11px] sm:text-xs font-semibold text-ink-3 truncate">{brand?.subtitle ?? "Web Học Tập THCS Nga Sơn"}</span>
      </span>
    </>
  );
  const brandCls = "flex items-center gap-2.5 min-h-12 pr-2 pl-1 rounded-2xl cursor-pointer min-w-0";

  return (
    <div data-topbar className="sticky top-0 z-30 pt-[max(8px,env(safe-area-inset-top))] pb-2">
      <div className="container-arena">
        <nav aria-label="Điều hướng chính" className="glass !rounded-[22px] flex items-center gap-2 pl-2 pr-2 py-1.5">
          {onHome
            ? <button onClick={onHome} className={brandCls} aria-label="Về trang chào Đấu Trường">{brandEl}</button>
            : <Link href={brand?.href ?? "/dau-truong"} className={brandCls} aria-label={brand ? "Về trang chủ" : "Về trang chào Đấu Trường"}>{brandEl}</Link>}
          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            {/* Trang chủ: hiện ở mọi kích thước (trừ khi đang ở chính trang chủ) — trên điện thoại là lối về duy nhất */}
            {active !== "portal" && (
              <Link href="/" aria-label="Về trang chủ" title="Trang chủ" className={linkBtn}>
                <House className="size-5" aria-hidden />
              </Link>
            )}
            <SoundToggle className="max-sm:hidden" />
            <Link href="/dau-truong/bang-xep-hang" aria-label="Bảng xếp hạng" title="Bảng xếp hạng"
              aria-current={active === "leaderboard" ? "page" : undefined}
              className={cx(linkBtn, active === "leaderboard" && "!bg-amber-50 !text-amber-700 !border-amber-200")}>
              <Medal className="size-5" strokeWidth={2.3} aria-hidden />
            </Link>
            {onAchievements
              ? <IconButton icon={TrophyIcon} label="Thành tích Đấu Trường" onClick={onAchievements} className="max-sm:!hidden shrink-0" />
              : <Link href="/dau-truong?view=thanh-tich" aria-label="Thành tích Đấu Trường" title="Thành tích Đấu Trường" className={cx(linkBtn, "max-sm:!hidden")}><TrophyIcon className="size-5" aria-hidden /></Link>}
            <LevelChip signedIn={!!me} ready={ready} />
            {onFeedback && <IconButton icon={MessageSquareHeart} label="Góp ý" onClick={onFeedback} className="max-md:hidden" />}
            {ready && (me
              ? <AccountMenu name={me.nickname} image={me.image} isTeacher={!!me.isTeacher} onSignOut={() => void signOut()} />
              : googleEnabled
                ? <button onClick={() => void signIn()} className="inline-flex items-center gap-2 min-h-11 sm:min-h-12 shrink-0 px-3 sm:px-4 rounded-2xl btn-primary font-extrabold text-[var(--fs-small)] cursor-pointer">
                    <LogIn className="size-4.5" aria-hidden /> <span className="max-sm:sr-only">Đăng nhập</span>
                  </button>
                : shownName
                  ? <span className="hidden md:inline-flex pill !bg-white !text-ink-2 border border-sky-100 min-h-10"><UserRound className="size-4 text-sky-brand" aria-hidden /> {shownName}</span>
                  : null)}
          </div>
        </nav>
      </div>
    </div>
  );
}

function AccountMenu({ name, image, isTeacher, onSignOut }: { name: string; image: string | null; isTeacher: boolean; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", close);
    return () => { window.removeEventListener("mousedown", close); window.removeEventListener("keydown", close); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu" aria-label={`Tài khoản: ${name}`}
        className="flex items-center gap-2 min-h-11 sm:min-h-12 pl-1 pr-1 sm:pl-1.5 sm:pr-1.5 md:pr-3 rounded-2xl bg-white/80 border border-white hover:bg-white cursor-pointer">
        {image
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={image} alt="" referrerPolicy="no-referrer" className="size-9 rounded-xl object-cover" />
          : <span className="grid place-items-center size-9 rounded-xl btn-primary font-black">{name.charAt(0).toUpperCase()}</span>}
        <span className="hidden md:block font-bold text-ink text-[var(--fs-small)] max-w-[120px] truncate">{name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 top-[calc(100%+8px)] w-56 glass !bg-white/95 !rounded-2xl p-2 z-40">
            <div className="px-3 py-2 text-xs font-semibold text-ink-3">Đăng nhập bằng Google</div>
            <Link role="menuitem" href="/ho-so" onClick={() => setOpen(false)} className="flex items-center gap-2 min-h-11 px-3 rounded-xl font-semibold text-ink hover:bg-sky-50">
              <Star className="size-4.5 text-deep" aria-hidden /> Hồ sơ của tôi
            </Link>
            <Link role="menuitem" href="/dau-truong?view=thanh-tich" onClick={() => setOpen(false)} className="flex items-center gap-2 min-h-11 px-3 rounded-xl font-semibold text-ink hover:bg-sky-50">
              <TrophyIcon className="size-4.5 text-deep" aria-hidden /> Thành tích Đấu Trường
            </Link>
            {isTeacher && (
              <Link role="menuitem" href="/giao-vien" onClick={() => setOpen(false)} className="flex items-center gap-2 min-h-11 px-3 rounded-xl font-semibold text-ink hover:bg-sky-50">
                <GraduationCap className="size-4.5 text-deep" aria-hidden /> Quản lý giáo viên
              </Link>
            )}
            <button role="menuitem" onClick={() => { setOpen(false); onSignOut(); }} className="w-full flex items-center gap-2 min-h-11 px-3 rounded-xl font-semibold text-red-700 hover:bg-red-50 cursor-pointer">
              <LogOut className="size-4.5" aria-hidden /> Đăng xuất
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Cấp độ hiện tại (vòng tiến độ nhỏ) — bấm để mở Hồ sơ */
function LevelChip({ signedIn, ready }: { signedIn: boolean; ready: boolean }) {
  const p = useProgress(signedIn, ready);
  const lv = p?.rank.level ?? 1;
  const pct = Math.round((p?.rank.progress ?? 0) * 100);
  return (
    <Link href="/ho-so" title={p ? `Cấp ${lv} · ${p.rank.name} · ${p.xp} Điểm Tri Thức` : "Hồ sơ của em"} aria-label={p ? `Hồ sơ: cấp ${lv}, ${p.xp} Điểm Tri Thức` : "Hồ sơ của em"}
      className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-12 shrink-0 pl-1 pr-1 sm:pr-3 rounded-2xl bg-white/80 border border-white shadow-[0_6px_16px_-10px_rgba(2,132,199,.5)] hover:bg-white transition">
      <span className="relative grid place-items-center size-9 rounded-xl text-white font-black text-sm"
        style={{ background: `conic-gradient(#10b981 ${pct}%, #bae6fd 0)` }}>
        <span className="absolute inset-[3px] rounded-[9px] bg-gradient-to-br from-sky-500 to-sky-700" />
        <span className="relative">{lv}</span>
      </span>
      <span className="hidden sm:block leading-tight text-left">
        <span className="block text-[10px] font-extrabold uppercase text-ink-3">Cấp {lv}</span>
        <span className="block text-xs font-black text-deep tabular-nums">{p ? `${p.xp.toLocaleString("vi-VN")} XP` : "Hồ sơ"}</span>
      </span>
    </Link>
  );
}

