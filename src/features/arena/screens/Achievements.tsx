import { motion } from "motion/react";
import {
  ArrowLeft, CalendarClock, Crown, Flame, Gamepad2, Lock, Play, Sprout, Swords, Target, Trash2, Trophy as TrophyIcon,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Cloud, HardDrive, Loader2, Medal } from "lucide-react";
import { Button, Card, Modal, ScreenTitle, Stat, cx, StickyActions } from "../components/ui";
import { GRADES, LEVELS } from "../data/meta";
import type { Grade, HistoryEntry, Level, Mode } from "../data/types";
import { BADGES, earnedBadgeIds } from "../game/badges";
import { formatDuration } from "../game/engine";
import { bestsFrom, type Best, type Profile } from "../lib/storage";

/**
 * Bảng thành tích cá nhân. `source`:
 *   "account" — lịch sử theo tài khoản Google (đồng bộ mọi thiết bị)
 *   "device"  — khách: lịch sử lưu trên trình duyệt này
 */
export function Achievements({ profile, history, source, onBack, onPlay, onClear }: {
  profile: Profile; history: HistoryEntry[] | null; source: "account" | "device";
  onBack: () => void; onPlay: () => void; onClear: () => void;
}) {
  const [mode, setMode] = useState<Mode>("practice");
  const [confirmClear, setConfirmClear] = useState(false);
  const name = profile.name || "Bạn";
  const cls = profile.className;

  if (history === null) {
    return (
      <div className="container-arena pb-12 grid place-items-center min-h-[40vh] text-ink-3 font-semibold" role="status">
        <span className="flex items-center gap-2"><Loader2 className="size-5 animate-spin" aria-hidden /> Đang tải thành tích…</span>
      </div>
    );
  }
  const bests: Record<string, Best> = bestsFrom(history);
  const badges = earnedBadgeIds(history);

  if (history.length === 0) {
    return (
      <div className="container-arena pb-12 max-w-[680px]">
        <ScreenTitle title="Thành tích của tôi" />
        <Card className="p-8 text-center">
          <div className="mx-auto grid place-items-center size-20 rounded-3xl bg-pill text-deep"><TrophyIcon className="size-10" aria-hidden /></div>
          <h2 className="mt-4 font-extrabold text-ink text-[length:var(--fs-h2)]">Chưa có lượt chơi nào</h2>
          <p className="mt-1.5 text-ink-2">Hoàn thành lượt đầu tiên để mở khóa huy hiệu “Ra mắt đấu trường” và bắt đầu lưu điểm cao.</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-2">
            <Button icon={Play} onClick={onPlay}>Chơi ngay</Button>
            <Link href="/dau-truong/bang-xep-hang" className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-[18px] bg-white/90 text-deep border border-sky-100 font-extrabold">
              <Medal className="size-5" aria-hidden /> Bảng xếp hạng
            </Link>
          </div>
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack} className="mt-2">Quay lại</Button>
        </Card>
      </div>
    );
  }

  const valid = history.filter((h) => !h.isRetry);
  const totalQ = valid.reduce((s, h) => s + h.total, 0);
  const totalC = valid.reduce((s, h) => s + h.correct, 0);
  const avgPct = totalQ ? Math.round((totalC / totalQ) * 100) : 0;
  const topScore = Math.max(0, ...valid.map((h) => h.score));
  const longest = Math.max(0, ...history.map((h) => h.maxStreak));
  const recent = history.slice(0, 8);
  const trend = valid.slice(0, 12).reverse();

  return (
    <div className="container-arena pb-12">
      <ScreenTitle title="Bảng thành tích" sub={
        <span className="inline-flex items-center gap-1.5">
          {source === "account" ? <><Cloud className="size-4" aria-hidden /> Đồng bộ theo tài khoản Google</> : <><HardDrive className="size-4" aria-hidden /> Lưu trên máy này (chế độ khách)</>}
          {" · "}theo dõi tiến bộ qua từng lượt chơi
        </span>} />

      {/* Hồ sơ */}
      <Card className="p-4 sm:p-6 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_0%,rgba(253,230,138,.45),transparent_50%)]" />
        <div className="relative flex items-center gap-4">
          <div className="grid place-items-center size-16 sm:size-20 rounded-[22px] btn-primary text-2xl sm:text-3xl font-black shrink-0">{name.charAt(0).toUpperCase()}</div>
          <div className="min-w-0">
            <div className="font-black text-ink text-[length:var(--fs-h2)] truncate">{name}</div>
            <div className="text-ink-3 font-semibold text-[var(--fs-small)]">{cls ? `Lớp ${cls} · ` : ""}{valid.length} lượt chơi · {badges.size}/{BADGES.length} huy hiệu</div>
          </div>
        </div>
        <div className="relative mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <Stat icon={Gamepad2} label="Lượt chơi" value={valid.length} tint="#0284c7" />
          <Stat icon={Target} label="Tỷ lệ đúng TB" value={`${avgPct}%`} tint="#059669" />
          <Stat icon={Crown} label="Điểm cao nhất" value={topScore.toLocaleString("vi-VN")} tint="#d97706" />
          <Stat icon={Flame} label="Chuỗi dài nhất" value={`${longest} câu`} tint="#ea580c" />
        </div>
      </Card>

      <div className="mt-4 grid lg:grid-cols-[1.3fr_1fr] gap-4">
        {/* Tiến bộ */}
        <Card className="p-4 sm:p-6">
          <h2 className="font-extrabold text-ink text-[length:var(--fs-h2)]">Tiến bộ qua các lượt</h2>
          <p className="text-[var(--fs-small)] text-ink-3 font-medium">Tỷ lệ trả lời đúng (%) · {trend.length} lượt gần nhất</p>
          <TrendChart rows={trend} />
        </Card>

        {/* Huy hiệu */}
        <Card className="p-4 sm:p-6">
          <h2 className="font-extrabold text-ink text-[length:var(--fs-h2)] mb-3">Huy hiệu</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 gap-2">
            {BADGES.map((b, i) => {
              const got = badges.has(b.id);
              const Icon = got ? b.icon : Lock;
              return (
                <motion.li key={b.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                  className={cx("rounded-2xl p-2.5 flex items-center gap-2.5 border", got ? "bg-white border-amber-100" : "bg-slate-50/70 border-slate-100")}
                  title={b.desc}>
                  <span className="grid place-items-center size-10 rounded-xl shrink-0" style={got ? { background: b.color, color: "#fff" } : { background: "#e2e8f0", color: "#64748b" }}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className={cx("block font-bold text-[var(--fs-small)] leading-tight", got ? "text-ink" : "text-ink-3")}>{b.name}</span>
                    <span className="block text-[11px] text-ink-3 leading-tight line-clamp-2">{b.desc}</span>
                  </span>
                  <span className="sr-only">{got ? "Đã đạt" : "Chưa đạt"}</span>
                </motion.li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Điểm cao theo khối × cấp độ */}
      <Card className="mt-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-extrabold text-ink text-[length:var(--fs-h2)]">Điểm cao theo khối & cấp độ</h2>
          <div role="tablist" aria-label="Chế độ" className="flex p-1 rounded-2xl bg-sky-50 border border-sky-100">
            {(["practice", "arena"] as Mode[]).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                className={cx("min-h-11 px-4 rounded-xl font-bold text-[var(--fs-small)] cursor-pointer flex items-center gap-1.5 transition-colors",
                  mode === m ? "bg-white text-deep shadow" : "text-ink-3 hover:text-ink")}>
                {m === "practice" ? <Sprout className="size-4" aria-hidden /> : <Swords className="size-4" aria-hidden />}
                {m === "practice" ? "Luyện tập" : "Thi đấu"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {([6, 7, 8, 9] as Grade[]).map((g) => (
            <div key={g} className="rounded-[20px] overflow-hidden border border-white bg-white/70">
              <div className="px-3.5 py-2 font-black text-white text-[var(--fs-small)]" style={{ background: `linear-gradient(120deg, ${GRADES[g].from}, ${GRADES[g].to})` }}>{GRADES[g].name}</div>
              <div className="p-2.5 grid gap-1.5">
                {(["basic", "advanced"] as Level[]).map((l) => <BestRow key={l} level={l} best={bests[`${g}-${l}-${mode}`]} />)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Lượt gần đây */}
      <Card className="mt-4 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-extrabold text-ink text-[length:var(--fs-h2)]">Lượt chơi gần đây</h2>
          {source === "device" && <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setConfirmClear(true)}>Xóa lịch sử</Button>}
        </div>
        <ul className="grid gap-2">
          {recent.map((h) => <HistoryRow key={h.id} h={h} />)}
        </ul>
      </Card>

      <StickyActions inner="grid grid-cols-[auto_1fr_1fr] gap-2 max-w-[760px] mx-auto">
        <Button variant="soft" icon={ArrowLeft} onClick={onBack} aria-label="Quay lại"><span className="max-sm:hidden">Quay lại</span></Button>
        <Link href="/dau-truong/bang-xep-hang" className="inline-flex items-center justify-center gap-2 min-h-12 px-3 sm:px-5 rounded-[18px] bg-white/90 text-deep border border-sky-100 font-extrabold whitespace-nowrap">
          <Medal className="size-5 shrink-0" aria-hidden /> <span className="max-sm:hidden">Bảng xếp hạng</span><span className="sm:hidden">Xếp hạng</span>
        </Link>
        <Button icon={Play} onClick={onPlay} className="max-sm:!px-3"><span className="max-sm:hidden">Chơi lượt mới</span><span className="sm:hidden">Chơi mới</span></Button>
      </StickyActions>

      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} title="Xóa lịch sử chơi?">
        <p className="text-ink-2">Toàn bộ lượt chơi lưu trên máy này sẽ bị xóa, kèm điểm cao và huy hiệu tính từ chúng.</p>
        <div className="mt-5 grid sm:grid-cols-2 gap-2">
          <Button variant="soft" onClick={() => setConfirmClear(false)} data-autofocus>Hủy</Button>
          <Button variant="danger" icon={Trash2} onClick={() => { onClear(); setConfirmClear(false); }}>Xóa</Button>
        </div>
      </Modal>
    </div>
  );
}

function BestRow({ level, best }: { level: Level; best?: Best }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-2.5 py-2">
      <span className="text-[var(--fs-small)] font-semibold text-ink-2">{LEVELS[level].emoji} {LEVELS[level].label}</span>
      {best ? (
        <span className="text-right leading-tight">
          <span className="block font-black text-ink tabular-nums">{best.correct}/{best.total}</span>
          <span className="block text-[11px] font-semibold text-ink-3">{best.pct}%</span>
        </span>
      ) : <span className="text-xs font-semibold text-slate-400">—</span>}
    </div>
  );
}

function HistoryRow({ h }: { h: HistoryEntry }) {
  const pct = Math.round((h.correct / h.total) * 100);
  const g = GRADES[h.grade];
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white/75 border border-white px-3 py-2.5">
      <span className="grid place-items-center size-11 rounded-xl text-white font-black shrink-0" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}>{h.grade}</span>
      <div className="min-w-0 flex-1">
        <div className="font-bold text-ink text-[var(--fs-small)] truncate">
          {LEVELS[h.level].label} · {h.mode === "arena" ? "Thi đấu" : "Luyện tập"}{h.isRetry ? " · Làm lại câu sai" : ""}
        </div>
        <div className="text-xs text-ink-3 font-medium flex items-center gap-1.5 flex-wrap">
          <CalendarClock className="size-3.5" aria-hidden />{relTime(h.date)} · {formatDuration(h.durationMs)} · <Flame className="size-3.5 text-orange-500" aria-hidden />{h.maxStreak}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-black text-ink tabular-nums">{h.correct}/{h.total}</div>
        <div className={cx("text-xs font-bold", pct >= 80 ? "text-emerald-700" : pct >= 50 ? "text-sky-700" : "text-amber-700")}>{pct}%</div>
      </div>
    </li>
  );
}

function relTime(t: number) {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.round(h / 24);
  return d < 7 ? `${d} ngày trước` : new Date(t).toLocaleDateString("vi-VN");
}

/** Biểu đồ cột một chuỗi: % đúng theo lượt (cũ → mới). Có tooltip khi rê/focus, bảng ẩn cho trình đọc màn hình. */
function TrendChart({ rows }: { rows: HistoryEntry[] }) {
  const [hi, setHi] = useState<number | null>(null);
  if (rows.length === 0) return <p className="mt-6 text-ink-3">Chưa có dữ liệu.</p>;
  return (
    <div className="mt-4">
      <div className="relative h-48 sm:h-56 2xl:h-72 pl-9">
        {/* lưới */}
        {[100, 80, 50, 0].map((v) => (
          <div key={v} className="absolute left-9 right-0 border-t border-dashed border-slate-200" style={{ bottom: `${v}%` }}>
            <span className="absolute -left-9 -translate-y-1/2 w-8 text-right text-[11px] font-semibold text-ink-3 tabular-nums">{v}%</span>
          </div>
        ))}
        <div className="absolute inset-0 left-9 flex items-end gap-[2px] sm:gap-1.5">
          {rows.map((h, i) => {
            const pct = Math.round((h.correct / h.total) * 100);
            const active = hi === i;
            return (
              <button key={h.id} type="button" className="relative flex-1 h-full flex items-end justify-center cursor-default focus-visible:outline-2"
                onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} onFocus={() => setHi(i)} onBlur={() => setHi(null)}
                aria-label={`Lượt ${i + 1}: ${pct}% (${h.correct}/${h.total}), khối ${h.grade}`}>
                <motion.span className="block w-full max-w-9 rounded-t-[4px]"
                  style={{ background: active ? "#0369a1" : "#0284c7" }}
                  initial={{ height: 0 }} animate={{ height: `${Math.max(pct, 2)}%` }} transition={{ delay: i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
                {active && (
                  <span className="absolute z-10 bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white border border-sky-100 shadow-lg px-2.5 py-1.5 text-xs text-left pointer-events-none"
                    style={{ bottom: `calc(${pct}% + 8px)` }}>
                    <span className="block font-black text-ink">{pct}% · {h.correct}/{h.total}</span>
                    <span className="block text-ink-3 font-medium">Khối {h.grade} · {h.mode === "arena" ? "Thi đấu" : "Luyện tập"}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-1.5 pl-9 flex justify-between text-[11px] font-semibold text-ink-3"><span>Cũ hơn</span><span>Gần nhất</span></div>
    </div>
  );
}
