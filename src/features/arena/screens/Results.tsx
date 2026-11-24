import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { sfx } from "@/lib/sfx";
import Link from "next/link";
import { CloudOff, Loader2, Medal } from "lucide-react";
import { GoogleButton } from "../components/GoogleButton";
import { useSession } from "../lib/session";
import {
  BookMarked, Clock3, Crosshair, Flame, Home, Lightbulb, MessageSquareHeart, RotateCcw, Shuffle, Star, Target, TrendingUp,
} from "lucide-react";
import { Button, Card, Confetti, CountUp, Stat, SubjectBadge, Trophy, cx, StickyActions } from "../components/ui";
import { GRADES, LEVELS, SUBJECTS } from "../data/meta";
import { ShareButton } from "@/features/share/ShareButton";
import type { RoundResult } from "../data/types";
import { badgeById } from "../game/badges";
import { analyse, formatDuration, rankFor, suggestions, summarize } from "../game/engine";

export interface ResultMeta {
  newRecord: boolean;
  newBadges: string[];
  /** trạng thái lưu kết quả lên server */
  save: "saving" | "saved" | "error";
  rank: { position: number; total: number } | null;
}

export function Results({ result, meta, attemptId, onReplay, onRetryWrong, onReview, onChangeSet, onHome, onFeedback, onRetrySave }: {
  result: RoundResult; meta: ResultMeta; onRetrySave: () => void;
  /** id lượt làm đã lưu ở server — có thì hiện nút chia sẻ */
  attemptId?: number;
  onReplay: () => void; onRetryWrong: () => void; onReview: () => void; onChangeSet: () => void; onHome: () => void; onFeedback: () => void;
}) {
  const reduce = useReducedMotion();
  const pct = summarize(result);
  const rank = rankFor(pct);
  const stats = analyse(result.questions, result.answers);
  const tips = suggestions(stats);
  const wrong = result.total - result.correct;
  const g = GRADES[result.config.grade];
  const high = pct >= 80;

  // Âm thanh kết quả: kèn chiến thắng khi ≥ 80%, chuông nhẹ khi thấp hơn; chuông huy hiệu khi có huy hiệu mới
  useEffect(() => { if (high) sfx.fanfare(); else sfx.finish(); }, [result.id, high]);
  const badgeCount = meta.newBadges.length;
  useEffect(() => {
    if (!badgeCount) return;
    const t = setTimeout(() => sfx.badge(), 1300);
    return () => clearTimeout(t);
  }, [badgeCount]);

  return (
    <div className="container-arena pb-12">
      <Confetti run={high} />

      {/* ============ Hero kết quả ============ */}
      <Card className="relative overflow-hidden px-5 py-6 sm:px-10 sm:py-9">
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ background: high ? "radial-gradient(ellipse at 22% 30%, rgba(253,230,138,.55), transparent 55%)" : "radial-gradient(ellipse at 22% 30%, rgba(125,211,252,.45), transparent 55%)" }} />
        <div className="relative grid md:grid-cols-[auto_1fr] items-center gap-5 md:gap-10">
          <motion.div className="relative mx-auto w-[150px] sm:w-[190px] 2xl:w-[260px]"
            initial={reduce ? false : { y: 50, scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.1 }}>
            {!reduce && <span aria-hidden className="absolute inset-[10%] rounded-full border-4 border-amber-300/60 pulse-ring" />}
            <RankEmblem rank={rank.key} />
          </motion.div>

          <div className="text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mb-2">
              <span className="pill" style={{ background: g.soft, color: g.ink }}>{g.name}</span>
              <span className="pill">{LEVELS[result.config.level].label} · {result.config.mode === "arena" ? "Thi đấu" : "Luyện tập"}</span>
              {result.isRetry && <span className="pill !bg-violet-50 !text-violet-700">Làm lại câu sai</span>}
            </div>
            <h1 className="sr-only">Kết quả lượt chơi</h1>
            <div className="flex items-end justify-center md:justify-start gap-3">
              <div className="font-black leading-none tracking-tight text-[clamp(3.4rem,2.4rem+4.5vw,7rem)] title-gradient">
                <CountUp value={result.correct} />
                <span className="text-[.55em] text-ink-3/70 [-webkit-text-fill-color:#94a3b8]"> / {result.total}</span>
              </div>
            </div>
            <motion.p className={cx("mt-2 font-black uppercase tracking-tight text-[length:var(--fs-h2)]", rank.tone === "gold" ? "text-amber-700" : rank.tone === "sky" ? "text-deep" : "text-emerald-deep")}
              initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              {rank.title} {high && "🏆"}
            </motion.p>
            <p className="text-ink-2 font-medium">{result.player ? `${result.player}, ` : ""}{rank.message.charAt(0).toLowerCase() + rank.message.slice(1)}</p>
            {meta.newRecord && (
              <motion.span className="mt-3 inline-flex pill !bg-amber-100 !text-amber-900" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.9, type: "spring" }}>
                <TrendingUp className="size-4" aria-hidden /> Kỷ lục mới của bạn!
              </motion.span>
            )}
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <Stat icon={Target} label="Tỷ lệ đúng" value={<CountUp value={pct} format={(n) => `${n}%`} />} tint="#059669" />
          <Stat icon={Clock3} label="Thời gian" value={formatDuration(result.durationMs)} tint="#0284c7" />
          <Stat icon={Flame} label="Chuỗi dài nhất" value={`${result.maxStreak} câu`} tint="#ea580c" />
          <Stat icon={Star} label="Điểm" value={<CountUp value={result.score} />} tint="#d97706" />
        </div>
      </Card>

      <RankStrip result={result} meta={meta} onRetrySave={onRetrySave} />

      {meta.newBadges.length > 0 && (
        <Card className="mt-4 p-4 sm:p-5">
          <h2 className="font-extrabold text-ink mb-3">Huy hiệu mới mở khóa</h2>
          <div className="flex flex-wrap gap-2.5">
            {meta.newBadges.map((id, i) => {
              const b = badgeById(id); if (!b) return null;
              const Icon = b.icon;
              return (
                <motion.div key={id} className="flex items-center gap-2.5 rounded-2xl bg-white border border-amber-200 pl-2 pr-3.5 py-2"
                  initial={reduce ? false : { scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 + i * 0.12, type: "spring", stiffness: 300, damping: 15 }}>
                  <span className="grid place-items-center size-10 rounded-xl text-white" style={{ background: b.color }}><Icon className="size-5" aria-hidden /></span>
                  <span><span className="block font-bold text-ink leading-tight">{b.name}</span><span className="block text-xs text-ink-3">{b.desc}</span></span>
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="mt-4 grid lg:grid-cols-[1.25fr_1fr] gap-4">
        {/* ============ Phân tích theo môn ============ */}
        <Card className="p-4 sm:p-6">
          <h2 className="flex items-center gap-2 font-extrabold text-ink text-[length:var(--fs-h2)] mb-4">
            <Crosshair className="size-5 text-sky-brand" aria-hidden /> Phân tích theo môn
          </h2>
          <ul className="grid gap-3.5">
            {stats.map((s, i) => (
              <li key={s.subject} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 items-center">
                <div className="flex items-center gap-2 min-w-0"><SubjectBadge subject={s.subject} size="sm" /></div>
                <div className="flex items-center gap-2 text-[var(--fs-small)]">
                  <span className="font-extrabold text-ink tabular-nums">{s.correct}/{s.total}</span>
                  <span className={cx("rounded-full px-2 py-0.5 text-xs font-bold",
                    s.verdict === "Xuất sắc" ? "bg-emerald-100 text-emerald-800" : s.verdict === "Tốt" ? "bg-sky-100 text-sky-800" : s.verdict === "Khá" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-800")}>
                    {s.verdict}
                  </span>
                </div>
                <div className="col-span-2 h-2.5 rounded-full bg-slate-100 overflow-hidden" role="img" aria-label={`${SUBJECTS[s.subject].short}: ${s.pct}% đúng`}>
                  <motion.div className="h-full rounded-full" style={{ background: SUBJECTS[s.subject].dot }}
                    initial={{ width: 0 }} animate={{ width: `${Math.max(s.pct, 2)}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* ============ Gợi ý ôn tập ============ */}
        <Card className="p-4 sm:p-6">
          <h2 className="flex items-center gap-2 font-extrabold text-ink text-[length:var(--fs-h2)] mb-3">
            <Lightbulb className="size-5 text-gold" aria-hidden /> Gợi ý ôn tập
          </h2>
          <ul className="grid gap-2.5">
            {tips.map((t, i) => (
              <li key={i} className="flex gap-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 p-3 text-ink font-medium">
                <BookMarked className="size-5 text-amber-700 shrink-0 mt-0.5" aria-hidden /> {t}
              </li>
            ))}
          </ul>
          {wrong > 0 && (
            <Button variant="soft" block className="mt-4" icon={BookMarked} onClick={onReview}>Xem lại {wrong} câu sai</Button>
          )}
        </Card>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {meta.save === "saved" && attemptId && <ShareButton req={{ kind: "arena", attemptId }} variant="soft" />}
        <Button variant="ghost" icon={MessageSquareHeart} onClick={onFeedback}>Đánh giá bộ đề này</Button>
      </div>

      {/* ============ Hành động — dính đáy màn hình ============ */}
      <StickyActions inner="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        <Button variant="soft" icon={RotateCcw} onClick={onReplay} className="max-sm:min-h-11">Làm lại</Button>
        <Button variant="soft" icon={Crosshair} onClick={onRetryWrong} disabled={wrong === 0} title={wrong === 0 ? "Bạn không sai câu nào" : undefined} className="max-sm:min-h-11">
          <span className="sm:hidden">Câu sai{wrong ? ` (${wrong})` : ""}</span>
          <span className="max-sm:hidden">Làm câu sai{wrong ? ` (${wrong})` : ""}</span>
        </Button>
        <Button variant="soft" icon={Shuffle} onClick={onChangeSet} className="max-sm:min-h-11">Đổi bộ đề</Button>
        <Button variant="primary" icon={Home} onClick={onHome} className="max-sm:min-h-11">Về trang chủ</Button>
      </StickyActions>
    </div>
  );
}

/** Huy hiệu xếp hạng: cúp vàng cho mức cao, huy chương cho các mức khác */
function RankEmblem({ rank }: { rank: "legend" | "gold" | "silver" | "bronze" }) {
  if (rank === "legend" || rank === "gold") {
    return (
      <div className="relative">
        <Trophy className="w-full drop-shadow-[0_20px_24px_rgba(180,83,9,.35)]" />
        <span className="absolute left-1/2 -translate-x-1/2 bottom-[2%] whitespace-nowrap rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-xs sm:text-sm font-black px-3 py-1 shadow-lg">
          {rank === "legend" ? "Tuyệt đối" : "Xuất sắc"}
        </span>
      </div>
    );
  }
  const c = rank === "silver" ? { a: "#e0f2fe", b: "#7dd3fc", c: "#0369a1", label: "Giỏi" } : { a: "#d1fae5", b: "#6ee7b7", c: "#047857", label: "Cố lên" };
  return (
    <svg viewBox="0 0 200 220" className="w-full drop-shadow-[0_18px_22px_rgba(2,132,199,.28)]" aria-hidden>
      <path d="M70 0 L100 70 L130 0 Z" fill={c.c} opacity=".9" />
      <path d="M40 0 H80 L110 72 H82 Z" fill={c.b} />
      <path d="M160 0 H120 L90 72 H118 Z" fill={c.c} />
      <circle cx="100" cy="135" r="70" fill={c.b} />
      <circle cx="100" cy="135" r="56" fill={c.a} stroke="#fff" strokeWidth="5" />
      <path d="M100 98 l11 22.4 24.6 3.6 -17.8 17.4 4.2 24.5 -22-11.6 -22 11.6 4.2-24.5 -17.8-17.4 24.6-3.6z" fill={c.c} />
      <rect x="55" y="190" width="90" height="26" rx="13" fill={c.c} />
      <text x="100" y="208" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" fontFamily="inherit">{c.label}</text>
    </svg>
  );
}

/** Dải trạng thái: đang lưu / lỗi lưu / hạng trên bảng xếp hạng / mời đăng nhập */
function RankStrip({ result, meta, onRetrySave }: { result: RoundResult; meta: ResultMeta; onRetrySave: () => void }) {
  const { me, googleEnabled, signIn } = useSession();
  const { grade, level, mode } = result.config;
  const boardHref = `/dau-truong/bang-xep-hang?grade=${grade}&level=${level}&mode=${mode}&period=week`;
  if (meta.save === "saving") {
    return <div className="mt-4 glass-soft px-4 py-3 flex items-center gap-2.5 text-ink-2 font-semibold text-[var(--fs-small)]" role="status"><Loader2 className="size-4 animate-spin" aria-hidden /> Đang lưu kết quả…</div>;
  }
  if (meta.save === "error") {
    return (
      <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex flex-wrap items-center gap-3 text-amber-900 font-semibold text-[var(--fs-small)]" role="status">
        <CloudOff className="size-5 shrink-0" aria-hidden />
        <span className="flex-1 min-w-[200px]">Chưa lưu được kết quả lên máy chủ{me ? "" : " — kết quả vẫn được lưu trên máy này"}.</span>
        <Button size="sm" variant="soft" onClick={onRetrySave}>Thử lại</Button>
      </div>
    );
  }
  if (result.isRetry) return null;
  if (meta.rank) {
    return (
      <Card className="mt-4 p-4 sm:p-5 flex flex-wrap items-center gap-4">
        <span className="grid place-items-center size-14 rounded-2xl btn-gold shrink-0"><Medal className="size-7" aria-hidden /></span>
        <div className="flex-1 min-w-[200px]">
          <div className="font-black text-ink text-[length:var(--fs-h2)] leading-tight">Hạng #{meta.rank.position} <span className="text-ink-3 font-bold text-[.7em]">/ {meta.rank.total} người</span></div>
          <div className="text-[var(--fs-small)] text-ink-3 font-semibold">Bảng xếp hạng tuần này · Khối {grade} · {LEVELS[level].label} · {mode === "arena" ? "Thi đấu" : "Luyện tập"}</div>
        </div>
        <Link href={boardHref} className="inline-flex items-center justify-center min-h-12 px-5 rounded-[18px] btn-primary font-extrabold">Xem bảng xếp hạng</Link>
      </Card>
    );
  }
  if (!me && googleEnabled) {
    return (
      <Card className="mt-4 p-4 sm:p-5 flex flex-wrap items-center gap-4">
        <span className="grid place-items-center size-14 rounded-2xl bg-pill text-deep shrink-0"><Medal className="size-7" aria-hidden /></span>
        <div className="flex-1 min-w-[200px]">
          <div className="font-extrabold text-ink">Muốn lên bảng xếp hạng?</div>
          <div className="text-[var(--fs-small)] text-ink-3 font-medium">Đăng nhập Google để các lượt chơi sau được ghi danh và lưu trên mọi thiết bị.</div>
        </div>
        <GoogleButton onClick={() => void signIn()} />
      </Card>
    );
  }
  return null;
}
