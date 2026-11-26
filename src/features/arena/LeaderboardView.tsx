"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Clock3, Crown, Flame, Info, Medal, Play, RefreshCw, Swords, Trophy as TrophyIcon, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { GoogleButton } from "./components/GoogleButton";
import { TopBar } from "./components/TopBar";
import { Card, ScreenTitle, cx } from "./components/ui";
import { GRADES, LEVELS } from "./data/meta";
import type { Grade, Level, Mode } from "./data/types";
import { fetchLeaderboard, type BoardEntry, type BoardQuery } from "./lib/api";
import { useSession } from "./lib/session";

const REFRESH_MS = 30_000;
const PERIODS = [
  { k: "week", label: "Tuần này" },
  { k: "month", label: "Tháng này" },
  { k: "all", label: "Mọi lúc" },
] as const;

type Board = Awaited<ReturnType<typeof fetchLeaderboard>>;

export function LeaderboardView({ initial, switcher }: { initial: BoardQuery; switcher?: ReactNode }) {
  const reduce = useReducedMotion();
  const { me, ready, googleEnabled, signIn } = useSession();
  const [q, setQ] = useState<BoardQuery>(initial);
  const [data, setData] = useState<Board | null>(null);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [manualSpin, setManualSpin] = useState(false);
  const [loadedKey, setLoadedKey] = useState("");
  const reqId = useRef(0);
  const qKey = JSON.stringify(q);
  const spinning = manualSpin || loadedKey !== qKey;

  const load = useCallback((query: BoardQuery) => {
    const id = ++reqId.current;
    const key = JSON.stringify(query);
    return fetchLeaderboard(query)
      .then((d) => { if (id === reqId.current) { setData(d); setError(false); setUpdatedAt(new Date()); } })
      .catch(() => { if (id === reqId.current) setError(true); })
      .finally(() => { if (id === reqId.current) { setLoadedKey(key); setManualSpin(false); } }); // bỏ kết quả cũ khi đổi bộ lọc nhanh
  }, []);

  // Tải lại khi đổi bộ lọc hoặc đăng nhập/đăng xuất; tự làm mới mỗi 30 giây (tiện chiếu lên lớp)
  useEffect(() => {
    if (!ready) return;
    void load(q);
    const t = setInterval(() => { if (document.visibilityState === "visible") void load(q); }, REFRESH_MS);
    return () => clearInterval(t);
  }, [q, ready, me, load]);

  const set = (patch: Partial<BoardQuery>) => {
    const next = { ...q, ...patch };
    setQ(next);
    const p = new URLSearchParams({ grade: String(next.grade), level: next.level, mode: next.mode, period: next.period });
    window.history.replaceState(null, "", `?${p}`);
  };

  const items = data?.items ?? [];
  const podium = items.filter((e) => e.rank <= 3).slice(0, 3);
  const rest = items.slice(podium.length);
  const meVisible = items.some((e) => e.isMe);
  const scopeLabel = [
    q.grade === "all" ? "Tất cả khối" : `Khối ${q.grade}`,
    q.level === "all" ? "mọi cấp độ" : LEVELS[q.level].label.toLowerCase(),
    q.mode === "arena" ? "Thi đấu" : "Luyện tập",
  ].join(" · ");

  return (
    <>
      <TopBar active="leaderboard" />
      <main id="main" className="flex-1 pt-1 sm:pt-3 pb-28">
        <div className="container-arena">
          <ScreenTitle
            eyebrow={<span className="pill !bg-amber-50 !text-amber-800"><Crown className="size-4" aria-hidden /> {PERIODS.find((p) => p.k === q.period)?.label}</span>}
            title="Bảng xếp hạng"
            sub={scopeLabel}
          />
          {switcher}

          {/* ---------- Bộ lọc ---------- */}
          <Card className="p-3 sm:p-4 grid gap-3 md:grid-cols-2 md:gap-x-6">
            <Seg label="Khối" value={String(q.grade)} onChange={(v) => set({ grade: v === "all" ? "all" : (Number(v) as Grade) })}
              options={[{ k: "all", label: "Tất cả" }, ...([6, 7, 8, 9] as Grade[]).map((g) => ({ k: String(g), label: String(g), color: GRADES[g].from }))]} />
            <Seg label="Cấp độ" value={q.level} onChange={(v) => set({ level: v as Level | "all" })}
              options={[{ k: "all", label: "Tất cả" }, { k: "basic", label: "Cơ bản" }, { k: "advanced", label: "Nâng cao" }]} />
            <Seg label="Chế độ" value={q.mode} onChange={(v) => set({ mode: v as Mode })}
              options={[{ k: "arena", label: "Thi đấu" }, { k: "practice", label: "Luyện tập" }]} />
            <Seg label="Thời gian" value={q.period} onChange={(v) => set({ period: v as BoardQuery["period"] })}
              options={PERIODS.map((p) => ({ k: p.k, label: p.label }))} />
          </Card>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[var(--fs-small)] text-ink-3 font-semibold">
            <span className="inline-flex items-center gap-1.5"><Users className="size-4" aria-hidden /> {data ? `${data.total} người được xếp hạng` : "Đang tải…"}</span>
            <button onClick={() => { setManualSpin(true); void load(q); }} className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-xl hover:bg-white/70 cursor-pointer" aria-label="Làm mới bảng xếp hạng">
              <RefreshCw className={cx("size-4", spinning && "animate-spin")} aria-hidden />
              {updatedAt ? `Cập nhật ${updatedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : "Làm mới"}
            </button>
          </div>

          {error && !data && (
            <Card className="mt-4 p-6 text-center text-ink-2">Không tải được bảng xếp hạng. Kiểm tra kết nối rồi bấm “Làm mới”.</Card>
          )}

          {data && items.length === 0 && (
            <Card className="mt-4 p-8 sm:p-10 text-center">
              <div className="mx-auto grid place-items-center size-20 rounded-3xl bg-amber-50 text-amber-600"><TrophyIcon className="size-10" aria-hidden /></div>
              <h2 className="mt-4 font-extrabold text-ink text-[length:var(--fs-h2)]">Chưa có ai ghi danh</h2>
              <p className="mt-1.5 text-ink-2">Hãy là người đầu tiên đứng trên bục vinh quang {PERIODS.find((p) => p.k === q.period)?.label.toLowerCase()}!</p>
              <Link href="/dau-truong" className="mt-5 inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-[18px] btn-primary font-extrabold">
                <Play className="size-5" aria-hidden /> Vào đấu trường
              </Link>
            </Card>
          )}

          {/* ---------- Bục vinh quang ---------- */}
          {podium.length > 0 && (
            <section aria-label="Top 3" className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end [&>*]:min-w-0">
              {podium.map((e, slot) => (
                // mobile: 1-2-3 từ trên xuống; desktop: 2-1-3 như bục trao giải
                <PodiumCard key={`${e.rank}-${e.name}-${slot}`} e={e} showScope={q.grade === "all" || q.level === "all"}
                  className={["sm:order-2", "sm:order-1", "sm:order-3"][slot]} reduce={!!reduce} delay={slot * 0.08} />
              ))}
            </section>
          )}

          {/* ---------- Danh sách ---------- */}
          {rest.length > 0 && (
            <Card className="mt-4 p-2 sm:p-3">
              <ol className="grid gap-1.5">
                <AnimatePresence initial={false}>
                  {rest.map((e) => (
                    <motion.li key={`${e.rank}-${e.name}-${e.className}`} layout={!reduce}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Row e={e} showScope={q.grade === "all" || q.level === "all"} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            </Card>
          )}

          <p className="mt-4 flex items-start gap-2 text-[var(--fs-small)] text-ink-3 font-medium">
            <Info className="size-4 mt-0.5 shrink-0" aria-hidden />
            Mỗi tài khoản Google tính 1 lượt cao nhất trong kỳ (điểm → số câu đúng → thời gian). Không tính chế độ khách và lượt “làm lại câu sai”. Tuần bắt đầu từ 0 giờ thứ Hai.
          </p>
        </div>
      </main>

      {/* ---------- Hạng của bạn (cố định dưới cùng) ---------- */}
      {ready && (
        <div className="fixed inset-x-0 bottom-0 z-30 pb-[max(10px,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
          <div className="container-arena">
            {me ? (
              data?.me ? (
                !meVisible || data.me.rank > 3 ? (
                  <div className="glass !rounded-[22px] px-3 py-2.5 sm:px-4 flex items-center gap-3 border-2 !border-sky-300">
                    <RankBadge rank={data.me.rank} />
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-ink truncate">Hạng của bạn · {data.me.name}</div>
                      <div className="text-xs text-ink-3 font-semibold">#{data.me.rank} trên {data.me.of} người · {data.me.correctCount}/{data.me.totalQuestions} câu</div>
                    </div>
                    <div className="font-black text-deep tabular-nums text-[clamp(1.1rem,1rem+.5vw,1.6rem)]">{data.me.score.toLocaleString("vi-VN")}</div>
                  </div>
                ) : null
              ) : data ? (
                <div className="glass !rounded-[22px] px-4 py-2.5 flex flex-wrap items-center gap-3">
                  <span className="flex-1 min-w-[180px] font-semibold text-ink-2 text-[var(--fs-small)]">Bạn chưa có lượt nào trong bảng này.</span>
                  <Link href="/dau-truong" className="inline-flex items-center gap-2 min-h-11 px-4 rounded-2xl btn-primary font-extrabold text-[var(--fs-small)]">
                    <Swords className="size-4" aria-hidden /> Vào thi đấu
                  </Link>
                </div>
              ) : null
            ) : googleEnabled ? (
              <div className="glass !rounded-[22px] px-4 py-2.5 flex flex-wrap items-center gap-3">
                <span className="flex-1 min-w-[180px] font-semibold text-ink-2 text-[var(--fs-small)]">Đăng nhập Google để ghi danh và xem hạng của bạn.</span>
                <GoogleButton onClick={() => void signIn()} className="min-h-11" />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

export function Seg({ label, value, options, onChange, className }: {
  label: string; value: string; options: { k: string; label: string; color?: string }[]; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div className={cx("flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 min-w-0", className)}>
      <span className="text-xs font-bold text-ink-3 uppercase tracking-wide sm:w-20 shrink-0">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex-1 grid grid-flow-col auto-cols-fr gap-1 p-1 rounded-2xl bg-sky-50/90 border border-sky-100">
        {options.map((o) => {
          const on = o.k === value;
          return (
            <button key={o.k} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.k)}
              className={cx("min-h-10 px-2 rounded-xl font-bold text-[var(--fs-small)] whitespace-nowrap cursor-pointer transition-colors",
                on ? "text-white shadow" : "text-ink-2 hover:bg-white")}
              style={on ? { background: o.color ?? "linear-gradient(100deg,#0284c7,#10b981)" } : undefined}>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MEDAL = {
  1: { bg: "linear-gradient(135deg,#fde68a,#f59e0b 55%,#b45309)", ring: "#f59e0b", label: "Vô địch" },
  2: { bg: "linear-gradient(135deg,#f1f5f9,#94a3b8 60%,#475569)", ring: "#94a3b8", label: "Á quân" },
  3: { bg: "linear-gradient(135deg,#fed7aa,#ea580c 60%,#9a3412)", ring: "#ea580c", label: "Hạng ba" },
} as const;

export function RankBadge({ rank }: { rank: number }) {
  const m = MEDAL[rank as 1 | 2 | 3];
  return m ? (
    <span className="grid place-items-center size-11 rounded-2xl text-white font-black shadow-md shrink-0" style={{ background: m.bg }} aria-label={`Hạng ${rank}`}>
      <Medal className="size-5" aria-hidden />
    </span>
  ) : (
    <span className="grid place-items-center size-11 rounded-2xl bg-sky-50 text-deep font-black tabular-nums shrink-0" aria-label={`Hạng ${rank}`}>{rank}</span>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  // Chỉ hiện chữ cái đầu — không hiển thị ảnh Google của học sinh khác
  const hue = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
  return (
    <span aria-hidden className={cx("grid place-items-center rounded-2xl text-white font-black shrink-0", size === "lg" ? "size-16 text-2xl" : "size-10 text-base")}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 40) % 360} 70% 38%))` }}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function scopeText(e: BoardEntry) {
  return `Khối ${e.grade} · ${LEVELS[e.level].label}`;
}

function PodiumCard({ e, showScope, className, reduce, delay }: { e: BoardEntry; showScope: boolean; className?: string; reduce: boolean; delay: number }) {
  const m = MEDAL[e.rank as 1 | 2 | 3] ?? MEDAL[3];
  const first = e.rank === 1;
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 18, delay }}>
      <Card className={cx("relative overflow-hidden text-center px-4 pt-5 pb-4", first ? "sm:pb-8 sm:pt-7" : "", e.isMe && "!border-2 !border-sky-400")}>
        <div aria-hidden className="absolute inset-x-0 top-0 h-24 opacity-30" style={{ background: `radial-gradient(ellipse at 50% 0%, ${m.ring}, transparent 70%)` }} />
        <div className="relative flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
          <div className="relative">
            <Avatar name={e.name} size="lg" />
            <span className="absolute -bottom-2 -right-2 grid place-items-center size-8 rounded-full text-white font-black text-sm border-2 border-white shadow" style={{ background: m.bg }}>{e.rank}</span>
          </div>
          <div className="min-w-0 flex-1 sm:mt-1">
            <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: m.ring }}>{first && <Crown className="inline size-3.5 -mt-0.5 mr-1" aria-hidden />}{m.label}</div>
            <div className="font-extrabold text-ink text-[clamp(1.05rem,1rem+.4vw,1.5rem)] truncate">{e.name}{e.isMe && <span className="ml-1.5 text-xs text-sky-700">(bạn)</span>}</div>
            <div className="text-xs text-ink-3 font-semibold">{[e.className && `Lớp ${e.className}`, showScope && scopeText(e)].filter(Boolean).join(" · ") || " "}</div>
          </div>
          <div className="shrink-0 sm:mt-2 text-right sm:text-center">
            <div className="font-black tabular-nums title-gradient text-[clamp(1.4rem,1.1rem+1.4vw,2.6rem)] leading-none">{e.score.toLocaleString("vi-VN")}</div>
            <div className="mt-1 text-xs text-ink-3 font-semibold whitespace-nowrap">{e.correctCount}/{e.totalQuestions} câu · {fmtTime(e.durationSec)}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Row({ e, showScope }: { e: BoardEntry; showScope: boolean }) {
  return (
    <div className={cx("flex items-center gap-3 rounded-2xl px-2.5 py-2 sm:px-3", e.isMe ? "bg-sky-50 border-2 border-sky-300" : "bg-white/70 border border-white")}>
      <RankBadge rank={e.rank} />
      <Avatar name={e.name} />
      <div className="min-w-0 flex-1">
        <div className="font-bold text-ink truncate">{e.name}{e.isMe && <span className="ml-1.5 text-xs text-sky-700">(bạn)</span>}</div>
        <div className="text-xs text-ink-3 font-medium flex flex-wrap items-center gap-x-2">
          {e.className && <span>Lớp {e.className}</span>}
          {showScope && <span>{scopeText(e)}</span>}
          <span className="inline-flex items-center gap-0.5"><Flame className="size-3.5 text-orange-500" aria-hidden />{e.maxStreak}</span>
          <span className="inline-flex items-center gap-0.5 max-sm:hidden"><Clock3 className="size-3.5" aria-hidden />{fmtTime(e.durationSec)}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-black text-ink tabular-nums">{e.score.toLocaleString("vi-VN")}</div>
        <div className="text-xs text-ink-3 font-semibold tabular-nums">{e.correctCount}/{e.totalQuestions}</div>
      </div>
    </div>
  );
}

export function fmtTime(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return m ? `${m}′${String(s).padStart(2, "0")}″` : `${s}″`;
}
