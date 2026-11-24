"use client";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight, ExternalLink, Flame, Gamepad2, LogIn, Presentation, Radio, GraduationCap, Keyboard, Medal, Play, School, Smartphone, Sparkles, Trophy as TrophyIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TopBar } from "@/features/arena/components/TopBar";
import { Trophy } from "@/features/arena/components/ui";
import { GAMES, type Game } from "@/lib/modules";
import { useIsClient } from "@/features/arena/lib/client";
import { GAME_ICONS } from "./gameIcons";
import { InstallApp, InstallBanner } from "./InstallApp";

/** Trang chủ cổng Web Học Tập: Đấu Trường Tri Thức + các trò chơi STEM */
export function PortalHome() {
  const prefersReducedMotion = useReducedMotion();
  const reduce = useIsClient() && prefersReducedMotion;
  const fade = (d = 0) => (reduce ? { animate: { opacity: 1, y: 0 }, transition: { duration: 0 } } : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.5 } });

  return (
    <>
      <TopBar active="portal" brand={{ title: "WEB HỌC TẬP THCS NGA SƠN", subtitle: "Hệ sinh thái tri thức & hành tinh xanh", href: "/" }} />
      <main id="main" className="flex-1">
        {/* ================= Hero ================= */}
        <section className="container-arena grid lg:grid-cols-[1.1fr_1fr] items-center gap-8 pt-4 pb-10 sm:pt-8">
          <div className="text-center lg:text-left">
            <motion.span className="pill" {...fade(0.05)}><School className="size-4" aria-hidden /> Trường THCS Nga Sơn · Sản phẩm STEM</motion.span>
            <motion.h1 {...fade(0.1)}
              className="mt-4 font-black uppercase tracking-tight leading-[1.06] pt-[.1em] text-[clamp(2rem,1rem+3.6vw,4.6rem)] title-gradient">
              Web Học Tập<br />THCS Nga Sơn
            </motion.h1>
            <motion.p {...fade(0.2)} className="mt-3 text-ink-2 text-[clamp(1rem,.95rem+.35vw,1.3rem)] max-w-[560px] mx-auto lg:mx-0">
              Học mà chơi, chơi mà học: luyện kiến thức Khối 6–9 trên Đấu Trường Tri Thức và khám phá vũ trụ, Trái Đất, đại dương và quang học qua các trò chơi STEM.
            </motion.p>
            <motion.div {...fade(0.3)} className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center lg:justify-start">
              <Link href="/dau-truong" className="inline-flex items-center justify-center gap-2.5 min-h-14 px-7 rounded-[20px] whitespace-nowrap btn-primary font-extrabold text-[clamp(1rem,.95rem+.3vw,1.25rem)] shine relative overflow-hidden">
                <GraduationCap className="size-5" aria-hidden /> Vào Đấu Trường
              </Link>
              <a href="#tro-choi" className="inline-flex items-center justify-center gap-2.5 min-h-14 px-7 rounded-[20px] whitespace-nowrap bg-white/90 text-deep border border-sky-100 font-extrabold text-[clamp(1rem,.95rem+.3vw,1.25rem)] hover:bg-white transition">
                <Gamepad2 className="size-5" aria-hidden /> Chơi trò chơi STEM
              </a>
            </motion.div>
            <div className="mt-3 flex justify-center lg:justify-start"><InstallApp /></div>
            <InstallBanner />
            <motion.dl {...fade(0.4)} className="mt-7 grid grid-cols-3 gap-2 max-w-[520px] mx-auto lg:mx-0">
              {[[String(GAMES.length + 1), "phân hệ"], [String(GAMES.length), "trò chơi STEM"], ["6–9", "khối lớp"]].map(([v, k]) => (
                <div key={k} className="glass-soft py-3 text-center">
                  <dt className="sr-only">{k}</dt>
                  <dd className="font-black text-deep text-[clamp(1.3rem,1.1rem+.8vw,2rem)] leading-none">{v}</dd>
                  <dd className="mt-1 text-xs font-semibold text-ink-3">{k}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
          <OrbitVisual reduce={!!reduce} />
        </section>

        {/* ================= Thử thách mỗi ngày ================= */}
        <section className="container-arena pb-5" aria-labelledby="daily-title">
          <motion.div {...fade(0.05)}>
            <Link href="/thu-thach" className="group flex flex-wrap items-center gap-4 rounded-[24px] px-5 py-4 text-white shadow-[0_20px_40px_-24px_rgba(217,119,6,.9)] hover:brightness-105 transition"
              style={{ background: "linear-gradient(110deg,#b45309,#d97706 55%,#059669)" }}>
              <span className="grid place-items-center size-12 rounded-2xl bg-white/20 shrink-0"><Flame className="size-7 text-amber-100" aria-hidden /></span>
              <span className="flex-1 min-w-[200px]">
                <span id="daily-title" className="block font-black text-xl uppercase tracking-tight">Thử thách mỗi ngày</span>
                <span className="block text-white/90 font-medium text-sm">5 câu · 2 phút · cả trường cùng một đề — giữ chuỗi ngày liên tiếp 🔥</span>
              </span>
              <span className="inline-flex items-center gap-2 min-h-11 px-5 rounded-2xl bg-white text-amber-800 font-extrabold">Chơi hôm nay <ArrowRight className="size-4.5 group-hover:translate-x-0.5 transition" aria-hidden /></span>
            </Link>
          </motion.div>
        </section>

        {/* ================= Đấu Trường (nổi bật) ================= */}
        <section className="container-arena" aria-labelledby="arena-title">
          <motion.div {...fade(0.1)} className="relative overflow-hidden rounded-[30px] p-6 sm:p-9 text-white shadow-[0_30px_60px_-30px_rgba(2,132,199,.8)]"
            style={{ background: "linear-gradient(120deg,#0369a1 0%,#0284c7 40%,#059669 100%)" }}>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(253,230,138,.45),transparent_45%)]" />
            <div aria-hidden className="absolute -left-16 -bottom-24 size-72 rounded-full border-[24px] border-white/10" />
            <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm font-bold">
                  <Sparkles className="size-4" aria-hidden /> Phân hệ 04 · Học tập
                </span>
                <h2 id="arena-title" className="mt-3 font-black uppercase tracking-tight text-[clamp(1.7rem,1.2rem+2vw,3rem)] leading-tight">Đấu Trường Tri Thức</h2>
                <p className="mt-2 max-w-[620px] text-white/90 font-medium text-[clamp(.95rem,.9rem+.25vw,1.15rem)]">
                  Trắc nghiệm Khối 6–9 nhiều môn, hai cấp độ Cơ bản và Nâng cao. Có chế độ Luyện tập kèm giải thích, Thi đấu có đếm giờ và combo, huy hiệu và bảng xếp hạng tuần.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="/dau-truong" className="inline-flex items-center gap-2 min-h-12 px-6 rounded-[18px] bg-white text-deep font-extrabold hover:bg-sky-50 transition">
                    <Play className="size-5" aria-hidden /> Bắt đầu
                  </Link>
                  <Link href="/dau-truong/bang-xep-hang" className="inline-flex items-center gap-2 min-h-12 px-6 rounded-[18px] bg-white/15 border border-white/40 font-extrabold hover:bg-white/25 transition">
                    <Medal className="size-5" aria-hidden /> Bảng xếp hạng
                  </Link>
                </div>
              </div>
              <div className="hidden md:block w-[180px] lg:w-[220px] trophy-float"><Trophy className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,.25)]" /></div>
            </div>
          </motion.div>
        </section>

        {/* ================= Lớp học trực tiếp ================= */}
        <section className="container-arena pt-6" aria-labelledby="live-title">
          <motion.div {...fade(0.15)} className="glass p-6 sm:p-8 grid md:grid-cols-[1fr_minmax(0,360px)] gap-6 items-center">
            <div>
              <span className="pill"><Radio className="size-4" aria-hidden /> Mới · Cả lớp cùng chơi</span>
              <h2 id="live-title" className="mt-3 font-black uppercase tracking-tight text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-tight title-gradient">Lớp học trực tiếp</h2>
              <p className="mt-2 max-w-[620px] text-ink-2 font-medium">
                Thầy cô chiếu câu hỏi lên màn hình, học sinh quét mã QR và trả lời bằng điện thoại. Đếm giờ, chấm điểm và bảng xếp hạng cập nhật ngay sau mỗi câu.
              </p>
              <Link href="/truc-tiep" className="mt-5 inline-flex items-center gap-2 min-h-12 px-6 rounded-[18px] btn-primary font-extrabold">
                <Presentation className="size-5" aria-hidden /> Mở phòng (giáo viên)
              </Link>
            </div>
            <JoinBox />
          </motion.div>
        </section>

        {/* ================= Trò chơi STEM ================= */}
        <section id="tro-choi" className="container-arena pt-12 pb-6 scroll-mt-24" aria-labelledby="games-title">
          <div className="text-center mb-6">
            <span className="pill"><Gamepad2 className="size-4" aria-hidden /> {GAMES.length} trò chơi</span>
            <h2 id="games-title" className="mt-3 font-black uppercase tracking-tight text-[length:var(--fs-h1)] title-gradient">Trò chơi STEM</h2>
            <p className="mt-1.5 text-ink-2">Lái chiến cơ, khám phá kỳ quan, làm sạch biển, dẫn ánh sáng và chuẩn bị phiên chợ làng cói Nga Sơn.</p>
          </div>
          <ul className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {GAMES.map((g, i) => <GameCard key={g.slug} g={g} delay={i * 0.08} reduce={!!reduce} />)}
          </ul>
        </section>

        {/* ================= Góc công nghệ ================= */}
        <section className="container-arena pt-6 pb-6" aria-labelledby="tech-title">
          <Link href="/cong-nghe" className="group glass p-5 sm:p-6 flex flex-wrap items-center gap-4 hover:brightness-105 transition">
            <span className="flex -space-x-2" aria-hidden>
              {[["HTML", "#e34c26"], ["CSS", "#2965f1"], ["JS", "#b88a00"], ["DB", "#059669"]].map(([t, c]) => (
                <span key={t} className="grid place-items-center size-12 rounded-2xl border-2 border-white text-white text-xs font-black" style={{ background: c }}>{t}</span>
              ))}
            </span>
            <span className="flex-1 min-w-[200px]">
              <span id="tech-title" className="block font-black text-ink text-lg">Bên trong ứng dụng: một trang web được làm từ gì?</span>
              <span className="block text-ink-2 text-sm">HTML, CSS, JavaScript và Cơ sở dữ liệu, giải thích dễ hiểu kèm khu thực hành tự bấm, tự sửa.</span>
            </span>
            <span className="font-extrabold text-deep group-hover:translate-x-1 transition">Khám phá →</span>
          </Link>
        </section>
      </main>
    </>
  );
}

function GameCard({ g, delay, reduce }: { g: Game; delay: number; reduce: boolean }) {
  const Icon = GAME_ICONS[g.slug];
  return (
    <motion.li className="glass overflow-hidden flex flex-col group"
      initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}>
      <Link href={`/tro-choi/${g.slug}`} className="relative block aspect-[16/8] overflow-hidden" tabIndex={-1} aria-hidden>
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} />
        <Scene slug={g.slug} />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold text-white border border-white/30">
          Phân hệ {g.no} · {g.realm}
        </span>
        <span className="absolute right-5 bottom-4 grid place-items-center size-16 sm:size-20 rounded-[22px] bg-white/20 border border-white/40 backdrop-blur text-white shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-4deg]">
          <Icon className="size-9 sm:size-11" strokeWidth={1.8} />
        </span>
      </Link>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="font-black text-ink text-[clamp(1.2rem,1.1rem+.5vw,1.6rem)] leading-tight">{g.title}</h3>
        <p className="mt-1 font-semibold text-[var(--fs-small)]" style={{ color: g.ink }}>{g.tagline}</p>
        <p className="mt-2 text-ink-2 text-[var(--fs-small)] leading-relaxed">{g.desc}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Điểm nổi bật">
          {g.chips.map((c) => <li key={c} className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: g.soft, color: g.ink }}>{c}</li>)}
        </ul>
        <dl className="mt-4 grid gap-1.5 text-[var(--fs-small)] text-ink-2">
          <div className="flex gap-2"><dt><Keyboard className="size-4 mt-0.5 text-ink-3" aria-label="Máy tính" /></dt><dd>{g.controls.desktop}</dd></div>
          <div className="flex gap-2"><dt><Smartphone className="size-4 mt-0.5 text-ink-3" aria-label="Cảm ứng" /></dt><dd>{g.controls.touch}</dd></div>
        </dl>
        <div className="mt-auto pt-5 flex gap-2">
          <Link href={`/tro-choi/${g.slug}`} className="flex-1 inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-[18px] text-white font-extrabold transition hover:brightness-110"
            style={{ background: `linear-gradient(100deg, ${g.from}, ${g.to})` }}>
            Chơi ngay <ArrowRight className="size-5" aria-hidden />
          </Link>
          <a href={g.file} target="_blank" rel="noopener" title="Mở riêng trong tab mới" aria-label={`Mở ${g.title} trong tab mới`}
            className="grid place-items-center size-12 rounded-[18px] bg-white border border-sky-100 text-deep hover:bg-sky-50 transition">
            <ExternalLink className="size-5" aria-hidden />
          </a>
        </div>
      </div>
    </motion.li>
  );
}

/** Họa tiết nền theo chủ đề: sao (vũ trụ), quỹ đạo (Trái Đất), bong bóng (đại dương) */
function Scene({ slug }: { slug: Game["slug"] }) {
  if (slug === "chien-co") {
    const stars = [[8, 20], [22, 60], [35, 30], [48, 75], [60, 18], [72, 52], [15, 80], [85, 30], [42, 50], [92, 70]];
    return (
      <div aria-hidden className="absolute inset-0">
        {stars.map(([x, y], i) => <span key={i} className="absolute rounded-full bg-white" style={{ left: `${x}%`, top: `${y}%`, width: i % 3 ? 3 : 5, height: i % 3 ? 3 : 5, opacity: 0.8, boxShadow: "0 0 8px #fff" }} />)}
        <span className="absolute left-[38%] top-[30%] h-[3px] w-24 -rotate-[25deg] rounded-full bg-gradient-to-r from-transparent to-white/90" />
      </div>
    );
  }
  if (slug === "quy-dao") {
    return (
      <div aria-hidden className="absolute inset-0">
        <span className="absolute left-[18%] top-1/2 -translate-y-1/2 size-28 rounded-full bg-[radial-gradient(circle_at_35%_35%,#6ee7b7,#0d9488_60%,#134e4a)] shadow-[0_0_40px_rgba(110,231,183,.6)]" />
        <span className="absolute left-[6%] top-1/2 -translate-y-1/2 h-16 w-52 rounded-[50%] border-2 border-white/50 -rotate-12" />
        <span className="absolute left-[48%] top-[28%] size-2.5 rounded-full bg-amber-200 shadow-[0_0_10px_#fde68a]" />
      </div>
    );
  }
  if (slug === "lang-coi-mo-hoi") {
    return <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/games/mo-hoi/san-hoi.webp)" }} />;
  }
  if (slug === "duong-sang-lang-coi") {
    return <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/games/lang-coi/sa-ban.webp)" }} />;
  }
  const bubbles = [[12, 70, 14], [24, 40, 8], [32, 78, 10], [46, 30, 6], [55, 64, 12], [66, 22, 8], [40, 55, 5]];
  return (
    <div aria-hidden className="absolute inset-0">
      {bubbles.map(([x, y, s], i) => <span key={i} className="absolute rounded-full border-2 border-white/60 bg-white/10" style={{ left: `${x}%`, top: `${y}%`, width: s * 2, height: s * 2 }} />)}
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full text-white/15"><path d="M0 30 Q50 0 100 30 T200 30 T300 30 T400 30 V60 H0Z" fill="currentColor" /></svg>
    </div>
  );
}

/** Hình minh họa hero: các phân hệ bay quanh quỹ đạo của "hành tinh tri thức" */
function OrbitVisual({ reduce }: { reduce: boolean }) {
  const nodes = [
    ...GAMES.map((g) => ({ key: g.slug, Icon: GAME_ICONS[g.slug], label: g.title, from: g.from, to: g.to, href: `/tro-choi/${g.slug}` })),
    { key: "arena", Icon: TrophyIcon, label: "Đấu Trường Tri Thức", from: "#f59e0b", to: "#d97706", href: "/dau-truong" },
  ];
  const angle = (i: number) => (i * 2 * Math.PI) / nodes.length - Math.PI / 2;
  return (
    <div className="relative mx-auto w-[min(86vw,460px)] aspect-square" aria-label="Các phân hệ">
      <div aria-hidden className="absolute inset-[6%] rounded-full border-2 border-dashed border-sky-300/70 ring-spin" />
      <div aria-hidden className="absolute inset-[22%] rounded-full border-2 border-emerald-300/60 ring-spin-rev" style={{ borderTopColor: "transparent" }} />
      <div aria-hidden className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#bae6fd_45%,#0284c7)] shadow-[0_0_80px_20px_rgba(56,189,248,.45)] grid place-items-center">
        <School className="size-[38%] text-white drop-shadow" strokeWidth={1.6} />
      </div>
      {!reduce && <div aria-hidden className="absolute inset-[30%] rounded-full border-4 border-sky-300/70 pulse-ring" />}
      {nodes.map((n, i) => (
        <Link key={n.key} href={n.href} title={n.label} aria-label={n.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center size-[clamp(56px,16%,78px)] rounded-[22px] text-white shadow-[0_14px_30px_-12px_rgba(2,132,199,.7)] border-2 border-white transition-transform hover:scale-110"
          style={{ left: `${50 + 44 * Math.cos(angle(i))}%`, top: `${50 + 44 * Math.sin(angle(i))}%`, background: `linear-gradient(135deg, ${n.from}, ${n.to})` }}>
          <n.Icon className="size-[48%]" strokeWidth={2} aria-hidden />
        </Link>
      ))}
    </div>
  );
}

/** Ô nhập mã phòng cho học sinh */
function JoinBox() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const valid = /^\d{6}$/.test(code);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) router.push(`/tham-gia?ma=${code}`); }}
      className="rounded-[24px] bg-white/80 border border-sky-100 p-5">
      <label htmlFor="join-code" className="font-extrabold text-ink">Học sinh: nhập mã phòng</label>
      <input id="join-code" inputMode="numeric" maxLength={6} placeholder="000000" value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="mt-2 w-full text-center font-black tracking-[.3em] text-3xl py-3 rounded-2xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none text-deep placeholder:text-slate-300" />
      <button type="submit" disabled={!valid}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 min-h-12 rounded-[18px] bg-deep text-white font-extrabold disabled:opacity-40 cursor-pointer">
        <LogIn className="size-5" aria-hidden /> Vào phòng
      </button>
    </form>
  );
}
