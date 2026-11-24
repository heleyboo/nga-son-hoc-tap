"use client";
import { CalendarCheck2, ClipboardList, Flame, Gamepad2, Lock, Sparkles, Swords, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArenaShell } from "@/features/arena/ArenaShell";
import { TopBar } from "@/features/arena/components/TopBar";
import { Stat, cx } from "@/features/arena/components/ui";
import type { HistoryEntry } from "@/features/arena/data/types";
import { BADGES, earnedBadgeIds } from "@/features/arena/game/badges";
import { fetchMyHistory } from "@/features/arena/lib/api";
import { useSession } from "@/features/arena/lib/session";
import { loadHistory, loadProfile } from "@/features/arena/lib/storage";
import { GAME_ICONS } from "@/features/portal/gameIcons";
import { GAMES } from "@/lib/modules";
import { GAME_BADGES, GAME_RULES, RANKS } from "@/lib/progress-rules";
import { useProgress } from "./store";

const noop = () => () => {};

/** Trang Hồ sơ: cấp độ, Điểm Tri Thức, chuỗi ngày, huy hiệu (Đấu Trường + trò chơi) và thành tích trò chơi */
export function ProfileApp() {
  return (
    <ArenaShell>
      <TopBar />
      <main id="main" className="container-arena max-w-5xl pb-12">
        <Profile />
      </main>
    </ArenaShell>
  );
}

function Profile() {
  const { me, ready, googleEnabled, signIn } = useSession();
  const p = useProgress(!!me, ready);
  const isClient = useSyncExternalStore(noop, () => true, () => false);

  // lịch sử Đấu Trường để tính 8 huy hiệu cũ (tài khoản: máy chủ; khách: trên máy)
  const [acct, setAcct] = useState<{ id: string; items: HistoryEntry[] } | null>(null);
  useEffect(() => {
    if (!me) return;
    let alive = true;
    fetchMyHistory().then((items) => { if (alive) setAcct({ id: me.id, items }); }).catch(() => { if (alive) setAcct({ id: me.id, items: [] }); });
    return () => { alive = false; };
  }, [me]);
  const history = me ? (acct?.id === me.id ? acct.items : []) : isClient ? loadHistory() : [];
  const arenaBadges = earnedBadgeIds(history);

  if (!ready || !p) return <p className="py-20 text-center text-ink-3 font-semibold">Đang tải hồ sơ…</p>;

  const name = me?.nickname || (isClient ? loadProfile().name : "") || "Bạn";
  const { rank, xp, streak, breakdown, counts } = p;
  const next = rank.to;
  const gotGame = new Set(p.gameBadges);
  const badgeTotal = BADGES.length + GAME_BADGES.length;
  const badgeGot = arenaBadges.size + gotGame.size;

  return (
    <>
      {/* ---------- Thẻ cấp độ ---------- */}
      <section className="mt-4 glass p-5 sm:p-7 grid gap-5 sm:grid-cols-[auto_1fr] items-center" aria-label="Cấp độ">
        <LevelRing level={rank.level} progress={rank.progress} />
        <div className="min-w-0">
          <p className="text-sm font-extrabold uppercase tracking-wider text-deep">Hồ sơ của {name}</p>
          <h1 className="font-black text-ink text-[length:var(--fs-h1)] leading-tight">Cấp {rank.level} · {rank.name}</h1>
          <div className="mt-3 h-4 rounded-full bg-sky-100 overflow-hidden" role="progressbar" aria-label="Tiến độ lên cấp" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(rank.progress * 100)}>
            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all" style={{ width: `${Math.max(3, rank.progress * 100)}%` }} />
          </div>
          <p className="mt-1.5 text-sm font-semibold text-ink-2">
            <b className="text-ink">{xp.toLocaleString("vi-VN")}</b> Điểm Tri Thức
            {next !== null ? <> · còn <b className="text-ink">{(next - xp).toLocaleString("vi-VN")}</b> điểm để lên Cấp {rank.level + 1} “{RANKS[rank.level].name}”</> : " · Cấp cao nhất!"}
          </p>
          <p className="mt-2 text-xs font-semibold text-ink-3">
            {me ? "Đã lưu vào tài khoản Google, xem được trên mọi máy." : "Đang lưu trên máy này."}
            {!me && googleEnabled && <> <button onClick={() => void signIn()} className="font-extrabold text-deep underline cursor-pointer">Đăng nhập Google</button> để giữ thành tích khi đổi máy.</>}
          </p>
        </div>
      </section>

      {/* ---------- Số liệu nhanh ---------- */}
      <section className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3" aria-label="Tổng quan">
        <Stat icon={Sparkles} label="Điểm Tri Thức" value={xp.toLocaleString("vi-VN")} tint="#d97706" />
        <Stat icon={Flame} label="Chuỗi ngày học" value={<>{streak.current} ngày{streak.best > streak.current && <span className="text-sm text-ink-3 font-bold"> · kỷ lục {streak.best}</span>}</>} tint="#ea580c" />
        <Stat icon={CalendarCheck2} label="Số ngày đã học" value={streak.activeDays} tint="#059669" />
        <Stat icon={Trophy} label="Huy hiệu" value={`${badgeGot}/${badgeTotal}`} tint="#7c3aed" />
      </section>
      {!streak.today && streak.current > 0 && (
        <p className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 font-semibold text-amber-900">🔥 Học thêm một lượt hôm nay để giữ chuỗi {streak.current} ngày nhé!</p>
      )}

      {/* ---------- XP từ đâu ---------- */}
      <h2 className="mt-8 font-black text-ink text-[length:var(--fs-h2)]">Điểm Tri Thức đến từ đâu</h2>
      <ul className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[
          { Icon: Swords, label: "Đấu Trường", xp: breakdown.arena, n: `${counts.arena} lượt`, href: "/dau-truong", c: "#0284c7" },
          { Icon: CalendarCheck2, label: "Thử thách mỗi ngày", xp: breakdown.daily, n: me ? `${counts.daily} ngày` : "cần đăng nhập", href: "/thu-thach", c: "#d97706" },
          { Icon: ClipboardList, label: "Bài tập thầy cô giao", xp: breakdown.assignments, n: me ? `${counts.assignments} bài` : "cần đăng nhập", href: "/bai-tap", c: "#059669" },
          { Icon: Gamepad2, label: "Trò chơi STEM", xp: breakdown.games, n: `${counts.games} lượt`, href: "/#tro-choi", c: "#7c3aed" },
        ].map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="glass-soft block p-4 h-full hover:brightness-105 transition">
              <s.Icon className="size-6" style={{ color: s.c }} aria-hidden />
              <p className="mt-2 font-bold text-ink-2 text-sm">{s.label}</p>
              <p className="font-black text-ink text-xl tabular-nums">{s.xp.toLocaleString("vi-VN")} XP</p>
              <p className="text-xs font-semibold text-ink-3">{s.n}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs font-semibold text-ink-3">Mỗi trò chơi STEM được cộng điểm tối đa 3 lượt mỗi ngày. Đấu Trường, thử thách ngày và bài tập không giới hạn.</p>

      {/* ---------- Trò chơi ---------- */}
      <h2 className="mt-8 font-black text-ink text-[length:var(--fs-h2)]">Thành tích trò chơi STEM</h2>
      <ul className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GAMES.map((g) => {
          const s = p.games[g.slug];
          const Icon = GAME_ICONS[g.slug];
          const rule = GAME_RULES[g.slug];
          return (
            <li key={g.slug} className="glass p-4 flex flex-col">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center size-11 rounded-2xl text-white shrink-0" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}><Icon className="size-5" aria-hidden /></span>
                <p className="font-black text-ink leading-tight">{g.title}</p>
              </div>
              <div className="mt-3 flex-1 text-sm font-semibold text-ink-2">
                {!s ? <p className="text-ink-3">Chưa chơi lượt nào.</p>
                  : rule.kind === "score" ? (
                    <p>Kỷ lục <b className="text-ink text-lg tabular-nums">{s.best?.toLocaleString("vi-VN") ?? "–"}</b> điểm{s.bestCorrect && <> · đúng {s.bestCorrect}</>}<br />{s.plays} lượt đã chơi</p>
                  ) : (
                    <p>Đã qua <b className="text-ink text-lg">{s.levels.length}/{rule.modes.length}</b> màn · {s.plays} lần hoàn thành</p>
                  )}
              </div>
              <Link href={`/tro-choi/${g.slug}`} className="mt-3 min-h-11 inline-flex items-center justify-center rounded-xl bg-white border border-sky-100 font-extrabold text-deep hover:bg-sky-50">{s ? "Chơi tiếp" : "Chơi ngay"}</Link>
            </li>
          );
        })}
      </ul>

      {/* ---------- Huy hiệu ---------- */}
      <h2 className="mt-8 font-black text-ink text-[length:var(--fs-h2)]">Huy hiệu <span className="text-ink-3 text-base">{badgeGot}/{badgeTotal}</span></h2>
      <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {BADGES.map((b) => <Badge key={b.id} on={arenaBadges.has(b.id)} name={b.name} desc={b.desc} color={b.color} icon={<b.icon className="size-6" aria-hidden />} />)}
        {GAME_BADGES.map((b) => <Badge key={b.id} on={gotGame.has(b.id)} name={b.name} desc={b.desc} color={b.color} icon={<span className="text-2xl" aria-hidden>{b.emoji}</span>} />)}
      </ul>

      {/* ---------- Các cấp ---------- */}
      <h2 className="mt-8 font-black text-ink text-[length:var(--fs-h2)]">Con đường 10 cấp</h2>
      <ol className="mt-3 grid sm:grid-cols-2 gap-1.5">
        {RANKS.map((r, i) => {
          const cur = i + 1 === rank.level, done = i + 1 < rank.level;
          return (
            <li key={r.name} className={cx("flex items-center gap-3 rounded-2xl px-3 py-2 font-semibold", cur ? "bg-sky-100 border-2 border-sky-400 text-ink" : done ? "bg-white/80 text-ink-2" : "bg-white/50 text-ink-3")}>
              <span className={cx("grid place-items-center size-9 rounded-xl font-black shrink-0", cur || done ? "btn-primary !shadow-none" : "bg-slate-100 text-slate-400")}>{i + 1}</span>
              <span className="flex-1">{r.name}</span>
              <span className="text-xs tabular-nums">{r.min.toLocaleString("vi-VN")} XP</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/dau-truong/bang-xep-hang?bang=xp" className="min-h-12 px-5 inline-flex items-center gap-2 rounded-2xl btn-primary font-extrabold"><Sparkles className="size-5" aria-hidden /> Bảng xếp hạng Điểm Tri Thức</Link>
        <Link href="/dau-truong?view=thanh-tich" className="min-h-12 px-5 inline-flex items-center gap-2 rounded-2xl bg-white border border-sky-100 font-extrabold text-deep"><Swords className="size-5" aria-hidden /> Chi tiết Đấu Trường</Link>
      </div>
    </>
  );
}

function LevelRing({ level, progress }: { level: number; progress: number }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto size-36" aria-hidden>
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e0f2fe" strokeWidth="12" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#lv)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${c * Math.max(0.02, progress)} ${c}`} />
        <defs><linearGradient id="lv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0ea5e9" /><stop offset="1" stopColor="#10b981" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><div className="text-xs font-extrabold text-ink-3 uppercase">Cấp</div><div className="font-black text-5xl text-deep leading-none">{level}</div></div>
      </div>
    </div>
  );
}

function Badge({ on, name, desc, color, icon }: { on: boolean; name: string; desc: string; color: string; icon: React.ReactNode }) {
  return (
    <li className={cx("glass-soft p-3 sm:p-4 text-center", !on && "opacity-55 grayscale")}>
      <span className="mx-auto grid place-items-center size-12 rounded-2xl text-white" style={{ background: on ? color : "#94a3b8" }}>{on ? icon : <Lock className="size-5" aria-hidden />}</span>
      <p className="mt-2 font-extrabold text-ink text-sm leading-tight">{name}</p>
      <p className="mt-0.5 text-xs text-ink-3 font-medium leading-snug">{desc}</p>
      <span className="sr-only">{on ? "Đã đạt" : "Chưa đạt"}</span>
    </li>
  );
}
