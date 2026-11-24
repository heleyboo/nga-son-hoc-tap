import { motion } from "motion/react";
import {
  AlertTriangle, ArrowLeft, BookOpenCheck, Check, Clock3, Flame, Infinity as InfinityIcon, Lightbulb, ListChecks,
  Play, Sprout, Swords, Trophy as TrophyIcon, Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button, Card, OptionTile, ScreenTitle, StickyActions, SubjectBadge, cx } from "../components/ui";
import { ARENA_SECONDS, GRADES, LEVELS, SUBJECTS, SUBJECT_ORDER } from "../data/meta";
import type { Catalog, GameConfig, Level, Mode, Subject } from "../data/types";

function Section({ n, title, children, hint }: { n: number; title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex items-center gap-2 mb-2.5 font-extrabold text-ink text-[clamp(1rem,.95rem+.3vw,1.3rem)]">
        <span className="grid place-items-center size-7 rounded-full bg-pill text-deep text-sm font-black">{n}</span>
        {title}
        {hint && <span className="text-[var(--fs-small)] font-medium text-ink-3">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

export function Config({ config, catalog, loading, onChange, onStart, onBack }: {
  config: GameConfig; catalog: Catalog | null; loading: boolean; onChange: (c: GameConfig) => void; onStart: () => void; onBack: () => void;
}) {
  const g = GRADES[config.grade];
  const set = (patch: Partial<GameConfig>) => onChange({ ...config, ...patch });

  const bySubject = catalog?.[config.grade]?.[config.level] ?? {};
  const subjectCounts = SUBJECT_ORDER.map((s) => ({ s, n: bySubject[s] ?? 0 })).filter((x) => x.n > 0);
  const levelTotal = subjectCounts.reduce((a, x) => a + x.n, 0);
  const available = config.subjects.length ? config.subjects.reduce((a, s) => a + (bySubject[s] ?? 0), 0) : levelTotal;
  const actual = Math.min(available, config.count);
  const short = available < config.count;
  const toggleSubject = (s: Subject) => {
    const has = config.subjects.includes(s);
    const next = has ? config.subjects.filter((x) => x !== s) : [...config.subjects, s];
    set({ subjects: next.length === subjectCounts.length ? [] : next });
  };
  const levelCount = (l: Level) => Object.values(catalog?.[config.grade]?.[l] ?? {}).reduce((a, n) => a + (n ?? 0), 0);

  const modeCard = (m: Mode, icon: ReactNode, title: string, lines: ReactNode[], accent: string) => (
    <OptionTile selected={config.mode === m} onSelect={() => set({ mode: m })} className="p-4 sm:p-5 flex gap-3.5 items-start" accent={accent}>
      <span className="grid place-items-center size-12 rounded-2xl shrink-0 text-white" style={{ background: accent }}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-extrabold text-ink text-[clamp(1.02rem,.95rem+.35vw,1.35rem)]">{title}</span>
          <SelectDot on={config.mode === m} color={accent} />
        </span>
        <span className="mt-1.5 grid gap-1">
          {lines.map((l, i) => <span key={i} className="flex items-center gap-1.5 text-[var(--fs-small)] text-ink-2 font-medium [&>svg]:shrink-0">{l}</span>)}
        </span>
      </span>
    </OptionTile>
  );

  return (
    <div className="container-arena pb-10">
      <ScreenTitle
        eyebrow={<span className="pill" style={{ background: g.soft, color: g.ink }}>{g.name}</span>}
        title="Thiết lập lượt chơi"
        sub="Tùy chỉnh theo sở thích của bạn"
      />

      <div className="grid lg:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_420px] gap-5 items-start">
        <Card className="p-4 sm:p-6 grid gap-6">
          <Section n={1} title="Cấp độ">
            <div role="radiogroup" aria-label="Cấp độ" className="grid grid-cols-2 gap-3">
              {(["basic", "advanced"] as Level[]).map((l) => {
                const accent = l === "basic" ? "#059669" : "#d97706";
                const Icon = l === "basic" ? Sprout : TrophyIcon;
                return (
                  <OptionTile key={l} selected={config.level === l} onSelect={() => set({ level: l, subjects: [] })} accent={accent} className="p-3.5 sm:p-4 flex items-center gap-3">
                    <span className="grid place-items-center size-11 rounded-2xl shrink-0" style={{ background: `${accent}1c`, color: accent }}>
                      <Icon className="size-6" strokeWidth={2.4} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-extrabold text-ink">{LEVELS[l].label}</span>
                      <span className="block text-[var(--fs-small)] text-ink-3 font-medium leading-tight">{LEVELS[l].hint} · {levelCount(l)} câu</span>
                    </span>
                    <SelectDot on={config.level === l} color={accent} className="hidden sm:grid" />
                  </OptionTile>
                );
              })}
            </div>
          </Section>

          <Section n={2} title="Môn học" hint="(chọn một hoặc nhiều)">
            <div className="flex flex-wrap gap-2">
              <Chip on={config.subjects.length === 0} onClick={() => set({ subjects: [] })} label={`Tất cả môn`} count={levelTotal} />
              {subjectCounts.map(({ s, n }) => (
                <Chip key={s} on={config.subjects.includes(s)} onClick={() => toggleSubject(s)} subject={s} label={SUBJECTS[s].short} count={n} />
              ))}
            </div>
          </Section>

          <Section n={3} title="Số câu hỏi">
            <div role="radiogroup" aria-label="Số câu hỏi" className="grid grid-cols-3 gap-2 p-1.5 rounded-[22px] bg-sky-50/90 border border-sky-100">
              {([10, 20, 30] as const).map((n) => {
                const on = config.count === n;
                return (
                  <button key={n} type="button" role="radio" aria-checked={on} onClick={() => set({ count: n })}
                    className={cx("relative min-h-12 rounded-[16px] font-extrabold cursor-pointer transition-colors", on ? "text-white" : "text-ink-2 hover:bg-white/80")}>
                    {on && <motion.span layoutId="count-pill" className="absolute inset-0 rounded-[16px] btn-primary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                    <span className="relative">{n} câu</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section n={4} title="Chế độ chơi">
            <div role="radiogroup" aria-label="Chế độ chơi" className="grid sm:grid-cols-2 gap-3">
              {modeCard("practice", <BookOpenCheck className="size-6" aria-hidden />, "Luyện tập", [
                <><InfinityIcon className="size-4 text-emerald-deep" aria-hidden />Không giới hạn thời gian</>,
                <><Lightbulb className="size-4 text-emerald-deep" aria-hidden />Giải thích sau mỗi câu</>,
                <><Check className="size-4 text-emerald-deep" aria-hidden />+10 điểm mỗi câu đúng</>,
              ], "#059669")}
              {modeCard("arena", <Swords className="size-6" aria-hidden />, "Thi đấu", [
                <><Clock3 className="size-4 text-gold" aria-hidden />{ARENA_SECONDS[config.level]} giây mỗi câu</>,
                <><Zap className="size-4 text-gold" aria-hidden />Thưởng tốc độ đến +50</>,
                <><Flame className="size-4 text-gold" aria-hidden />Combo từ chuỗi 3 câu đúng</>,
              ], "#d97706")}
            </div>
          </Section>

        </Card>

        {/* Tóm tắt */}
        <Card className="p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 font-extrabold text-ink text-[length:var(--fs-h2)]">
            <ListChecks className="size-6 text-sky-brand" aria-hidden /> Tóm tắt
          </h2>
          <dl className="mt-4 grid gap-2.5 text-[var(--fs-body)]">
            <Row k="Khối" v={<span className="font-extrabold" style={{ color: g.ink }}>{g.name.replace("KHỐI", "Khối")}</span>} />
            <Row k="Cấp độ" v={`${LEVELS[config.level].emoji} ${LEVELS[config.level].label}`} />
            <Row k="Môn" v={config.subjects.length === 0 ? "Tất cả môn" : (
              <span className="flex flex-wrap justify-end gap-1">{config.subjects.map((s) => <SubjectBadge key={s} subject={s} size="sm" />)}</span>
            )} />
            <Row k="Số câu" v={`${actual} câu`} />
            <Row k="Chế độ" v={config.mode === "arena" ? "⚔️ Thi đấu" : "📘 Luyện tập"} />
            <Row k="Thời gian" v={config.mode === "arena" ? `≈ ${Math.ceil((actual * ARENA_SECONDS[config.level]) / 60)} phút tối đa` : "Không giới hạn"} />
          </dl>
          {short && catalog && (
            <div className={cx("mt-4 flex gap-2.5 rounded-2xl border px-3.5 py-3 text-[var(--fs-small)] font-medium",
              available === 0 ? "bg-red-50 border-red-200 text-red-900" : "bg-amber-50 border-amber-200 text-amber-900")} role="status">
              <AlertTriangle className="size-5 shrink-0" aria-hidden />
              {available === 0
                ? "Chưa có câu hỏi phù hợp. Hãy chọn môn hoặc cấp độ khác."
                : <span>Kho hiện chỉ có <b>{available} câu</b> phù hợp. Lượt chơi sẽ gồm {available} câu.</span>}
            </div>
          )}
          <div className="hidden lg:grid gap-2 mt-5">
            <Button size="lg" block iconRight={Play} onClick={onStart} disabled={available === 0 || loading}>{loading ? "Đang tải đề…" : "Bắt đầu chơi"}</Button>
            <Button variant="ghost" block icon={ArrowLeft} onClick={onBack}>Đổi khối</Button>
          </div>
        </Card>
      </div>

      {/* Thanh hành động dính đáy trên mobile/tablet — trong tầm ngón cái.
          Dùng sticky (không dùng fixed): màn hình nằm trong khung có transform của hiệu ứng chuyển cảnh,
          fixed sẽ bám theo khung đó và bị đẩy xuống cuối trang. */}
      <StickyActions className="lg:hidden">
        <Button variant="soft" icon={ArrowLeft} onClick={onBack} aria-label="Quay lại chọn khối" className="!px-4">
          <span className="hidden sm:inline">Quay lại</span>
        </Button>
        <Button size="lg" className="flex-1" iconRight={Play} onClick={onStart} disabled={available === 0 || loading}>
          {loading ? "Đang tải đề…" : `Bắt đầu · ${actual} câu`}
        </Button>
      </StickyActions>
    </div>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-dashed border-sky-100 pb-2 last:border-0">
      <dt className="text-ink-3 font-medium shrink-0">{k}</dt>
      <dd className="font-bold text-ink text-right min-w-0">{v}</dd>
    </div>
  );
}

function SelectDot({ on, color, className }: { on: boolean; color: string; className?: string }) {
  return (
    <span aria-hidden className={cx("grid place-items-center size-6 rounded-full border-2 shrink-0 transition-colors", className)}
      style={{ borderColor: on ? color : "#cbd5e1", background: on ? color : "transparent" }}>
      {on && <Check className="size-3.5 text-white" strokeWidth={3.5} />}
    </span>
  );
}

function Chip({ on, onClick, label, count, subject }: { on: boolean; onClick: () => void; label: string; count: number; subject?: Subject }) {
  const m = subject ? SUBJECTS[subject] : null;
  const Icon = m?.icon;
  return (
    <motion.button type="button" role="checkbox" aria-checked={on} onClick={onClick} whileTap={{ scale: 0.95 }}
      className={cx("inline-flex items-center gap-1.5 min-h-11 pl-2 pr-3 rounded-full border-2 font-bold text-[var(--fs-small)] cursor-pointer transition-colors",
        on ? "bg-white shadow-[0_8px_18px_-10px_rgba(2,132,199,.6)]" : "bg-white/90 border-sky-100 hover:bg-white hover:border-sky-200")}
      style={{ borderColor: on ? (m?.dot ?? "#0284c7") : undefined }}>
      <span className="grid place-items-center size-7 rounded-full transition-colors"
        style={{ background: on ? (m?.dot ?? "#0284c7") : (m?.bg ?? "#e0f2fe"), color: on ? "#fff" : (m?.fg ?? "#0369a1") }}>
        {on ? <Check className="size-4" strokeWidth={3} aria-hidden /> : Icon ? <Icon className="size-4" aria-hidden strokeWidth={2.4} /> : <ListChecks className="size-4" aria-hidden />}
      </span>
      <span className="text-ink">{label}</span>
      <span className="text-ink-3 font-semibold">{count}</span>
    </motion.button>
  );
}
