import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Crosshair, Flag, Lightbulb, PartyPopper, TimerOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MathText } from "../components/MathText";
import { ReportDialog } from "../components/ReportDialog";
import { Button, Card, ScreenTitle, SubjectBadge, cx, StickyActions } from "../components/ui";
import type { RoundQuestion, RoundResult } from "../data/types";

const L = ["A", "B", "C", "D", "E", "F"];

export function Review({ result, onBack, onRetryWrong }: { result: RoundResult; onBack: () => void; onRetryWrong: () => void }) {
  const reduce = useReducedMotion();
  const items = result.questions
    .map((q, i) => ({ q, a: result.answers[i] }))
    .filter((x) => x.a && !x.a.correct);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [reporting, setReporting] = useState<RoundQuestion | null>(null);
  const go = (d: number) => { setDir(d); setI((v) => Math.min(items.length - 1, Math.max(0, v + d))); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (reporting || (e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (items.length === 0) {
    return (
      <div className="container-arena pb-12 max-w-[640px]">
        <Card className="p-8 text-center">
          <PartyPopper className="size-14 mx-auto text-gold" aria-hidden />
          <h1 className="mt-3 font-black text-[length:var(--fs-h1)] title-gradient uppercase">Không có câu sai!</h1>
          <p className="mt-2 text-ink-2">Bạn đã trả lời đúng tất cả các câu trong lượt này.</p>
          <Button className="mt-5" icon={ArrowLeft} onClick={onBack}>Về kết quả</Button>
        </Card>
      </div>
    );
  }

  const { q, a } = items[i];
  return (
    <div className="container-arena pb-12">
      <ScreenTitle
        eyebrow={<span className="pill !bg-red-50 !text-red-800">{items.length} câu cần xem lại</span>}
        title="Xem lại câu sai"
        sub="Hiểu vì sao sai là cách nhanh nhất để nhớ lâu."
      />

      {/* chỉ mục câu */}
      <nav aria-label="Chọn câu" className="flex gap-1.5 justify-center flex-wrap mb-4">
        {items.map((it, k) => (
          <button key={it.q.id} onClick={() => { setDir(k > i ? 1 : -1); setI(k); }} aria-current={k === i ? "step" : undefined}
            aria-label={`Câu sai thứ ${k + 1}`}
            className={cx("min-w-11 h-11 px-2 rounded-2xl font-extrabold cursor-pointer transition-colors",
              k === i ? "btn-primary !shadow-none" : "bg-white/80 text-ink-2 hover:bg-white border border-white")}>
            {k + 1}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div key={q.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.25 }}>
          <Card className="p-5 sm:p-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sky-brand text-[var(--fs-small)] tracking-wider">CÂU {result.questions.indexOf(q) + 1}</span>
              <SubjectBadge subject={q.subject} size="sm" />
              {q.topic && <span className="text-[var(--fs-small)] text-ink-3 font-semibold">{q.topic}</span>}
              <button onClick={() => setReporting(q)}
                className="ml-auto inline-flex items-center gap-1.5 min-h-11 px-3 rounded-2xl text-[var(--fs-small)] font-bold text-red-700 hover:bg-red-50 cursor-pointer">
                <Flag className="size-4" aria-hidden /> Báo lỗi
              </button>
            </div>
            <h2 className="mt-2 font-bold text-ink text-[length:var(--fs-q)] leading-snug break-words"><MathText text={q.q} /></h2>

            <div className="mt-5 grid md:grid-cols-2 gap-3">
              <div className="rounded-[20px] border-2 border-red-300 bg-red-50 p-4">
                <div className="flex items-center gap-2 text-red-800 font-extrabold text-[var(--fs-small)]">
                  {a.selected === null ? <TimerOff className="size-4.5" aria-hidden /> : <X className="size-4.5" strokeWidth={3} aria-hidden />}
                  Bạn đã chọn
                </div>
                <div className="mt-1.5 font-semibold text-ink text-[length:var(--fs-ans)]">
                  {a.selected === null ? <span className="text-ink-2">Hết giờ — chưa chọn đáp án</span> : <><b>{L[a.selected]}.</b> <MathText text={q.options[a.selected]} /></>}
                </div>
              </div>
              <div className="rounded-[20px] border-2 border-emerald-400 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-[var(--fs-small)]">
                  <Check className="size-4.5" strokeWidth={3} aria-hidden /> Đáp án đúng
                </div>
                <div className="mt-1.5 font-semibold text-ink text-[length:var(--fs-ans)]"><b>{L[q.answer ?? 0]}.</b> <MathText text={q.options[q.answer ?? 0]} /></div>
              </div>
            </div>

            <div className="mt-3 rounded-[20px] bg-sky-50/80 border border-sky-100 p-4">
              <div className="flex items-center gap-2 font-extrabold text-deep text-[var(--fs-small)] mb-1">
                <Lightbulb className="size-4.5" aria-hidden /> Giải thích
                {q.explainStatus === "draft" && <span className="ml-auto text-[11px] font-semibold text-ink-3 bg-white rounded-full px-2 py-0.5 border border-slate-200">bản nháp · chờ GV duyệt</span>}
              </div>
              <p className="text-ink leading-relaxed">{q.explain ? <MathText text={q.explain} /> : <span className="text-ink-2">Chưa có giải thích cho câu này — giáo viên sẽ bổ sung.</span>}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <StickyActions inner="flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <Button variant="soft" icon={ChevronLeft} onClick={() => go(-1)} disabled={i === 0} aria-label="Câu trước">
            <span className="hidden sm:inline">Câu trước</span>
          </Button>
          <span className="flex-1 text-center font-extrabold text-ink-2 tabular-nums">{i + 1} / {items.length}</span>
          <Button variant="soft" iconRight={ChevronRight} onClick={() => go(1)} disabled={i === items.length - 1} aria-label="Câu tiếp">
            <span className="hidden sm:inline">Câu tiếp</span>
          </Button>
        </div>
        <div className="grid w-full grid-cols-[auto_1fr] gap-2">
          <Button variant="soft" icon={ArrowLeft} onClick={onBack} aria-label="Về kết quả"><span className="max-sm:hidden">Về kết quả</span></Button>
          <Button icon={Crosshair} onClick={onRetryWrong}>Luyện lại {items.length} câu này</Button>
        </div>
      </StickyActions>
      <ReportDialog question={reporting} onClose={() => setReporting(null)} />
    </div>
  );
}
