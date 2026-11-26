import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight, Check, Clock3, Loader2, Flag, Flame, Lightbulb, LogOut, Pause, Play, Sparkles, Star, TimerOff, X, Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MathText, plainMath } from "../components/MathText";
import { ReportDialog } from "../components/ReportDialog";
import { useToast } from "../components/Toast";
import { checkAnswer, keepConnectionWarm } from "../lib/api";
import { Button, Card, CountUp, IconButton, Modal, ProgressBar, SubjectBadge, cx } from "../components/ui";
import { SoundToggle } from "../components/SoundToggle";
import { sfx, vibrate } from "@/lib/sfx";
import { ARENA_SECONDS, GRADES, LEVELS } from "../data/meta";
import type { AnswerRecord, GameConfig, RoundQuestion, RoundResult } from "../data/types";
import { scoreAnswer } from "../game/engine";
import { uid } from "../lib/storage";

export interface ActiveRound {
  key: string;
  config: GameConfig;
  questions: RoundQuestion[];
  isRetry: boolean;
  player: string;
  className: string;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface Gain { points: number; speedBonus: number; comboBonus: number; comboBefore: number }

export function Quiz({ round, onFinish, onExit }: {
  round: ActiveRound; onFinish: (r: RoundResult) => void; onExit: () => void;
}) {
  const { config, questions } = round;
  const arena = config.mode === "arena";
  const limitMs = ARENA_SECONDS[config.level] * 1000;
  const reduce = useReducedMotion();

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [gain, setGain] = useState<Gain | null>(null);
  const [paused, setPaused] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [reporting, setReporting] = useState<RoundQuestion | null>(null);

  // --- đồng hồ: chỉ chạy khi không tạm dừng / không mở hộp thoại / chưa trả lời
  const [qs, setQs] = useState(round.questions); // câu hỏi + đáp án/giải thích sau khi server chấm
  const [pending, setPending] = useState<number | null | undefined>(undefined); // đang chờ server chấm
  const checking = pending !== undefined;
  const toast = useToast();
  const running = !revealed && !checking && !paused && !confirmExit && !reporting;
  const qElapsed = useRef(0);
  const lastTick = useRef(0);
  const roundStart = useRef(0);
  useEffect(() => { roundStart.current = Date.now(); }, []);
  useEffect(() => keepConnectionWarm(), []); // tránh kết nối bị cắt ngầm khi đang suy nghĩ
  const pausedMs = useRef(0);
  const pauseStarted = useRef<number | null>(null);
  const [, force] = useState(0);
  const [timeLeft, setTimeLeft] = useState(limitMs);

  const q = qs[idx];

  // Sau khi chấm: tự cuộn tới khung đúng/sai + giải thích.
  // Khung vừa màn hình → đặt đáy khung ngay trên nút "Câu tiếp" (vẫn thấy được các đáp án phía trên);
  // khung dài hơn → đặt đầu khung ngay dưới thanh tiến độ dính trên cùng.
  useEffect(() => {
    if (!revealed) return;
    const t = window.setTimeout(() => {
      const card = document.querySelector<HTMLElement>("[data-feedback]");
      if (!card) return;
      const header = document.querySelector<HTMLElement>("[data-quiz-header]");
      const hr = header?.getBoundingClientRect();
      const topLimit = hr && getComputedStyle(header!).position === "sticky" ? hr.bottom + 12 : 12;
      const btn = [...document.querySelectorAll<HTMLElement>("[data-next]")].find((b) => b.offsetParent !== null);
      const bottomLimit = (btn ? btn.getBoundingClientRect().top : innerHeight) - 16;
      const r = card.getBoundingClientRect();
      if (r.top >= topLimit && r.bottom <= bottomLimit) return; // đã thấy trọn vẹn
      const delta = r.height <= bottomLimit - topLimit ? r.bottom - bottomLimit : r.top - topLimit;
      window.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
    }, 180); // chờ khung giải thích và thanh nút hiện xong
    return () => window.clearTimeout(t);
  }, [revealed, idx, reduce]);

  // Âm thanh: bắt đầu lượt; tích tắc 5 giây cuối (chế độ Thi đấu)
  useEffect(() => { sfx.start(); }, []);
  const secLeft = Math.ceil(timeLeft / 1000);
  const tickedRef = useRef<string>("");
  useEffect(() => {
    if (!arena || !running || revealed || secLeft < 1 || secLeft > 5) return;
    const k = `${idx}:${secLeft}`;
    if (tickedRef.current === k) return;
    tickedRef.current = k;
    sfx.tick(secLeft);
  }, [arena, running, revealed, secLeft, idx]);

  /** Sau khi đóng hộp thoại, đưa focus về nút “Câu tiếp” (nếu đã trả lời) để Enter không mở lại hộp thoại */
  const resume = () => {
    setPaused(false);
    setTimeout(() => {
      const btn = [...document.querySelectorAll<HTMLButtonElement>("[data-next]")].find((b) => b.offsetParent !== null);
      if (btn) btn.focus(); else (document.activeElement as HTMLElement | null)?.blur();
    }, 60);
  };
  const isLast = idx === questions.length - 1;

  const revealedRef = useRef(false); // chặn ghi nhận 2 lần (bấm đúp, hết giờ trùng lúc bấm, StrictMode)
  const reveal = useCallback(async (choice: number | null) => {
    if (revealed || revealedRef.current || !q) return;
    revealedRef.current = true;
    const timeMs = Math.round(qElapsed.current);
    if (choice !== null) sfx.tap();
    setPending(choice);
    let r: Awaited<ReturnType<typeof checkAnswer>>;
    try {
      r = await checkAnswer(q, choice);
    } catch {
      revealedRef.current = false;
      setPending(undefined);
      toast("Mất kết nối tới máy chủ — chọn lại đáp án nhé.", "info");
      return;
    }
    const s = scoreAnswer({ correct: r.correct, mode: config.mode, level: config.level, timeMs, comboBefore: combo });
    // âm thanh phản hồi: đúng (+ chuỗi), sai (+ rung nhẹ), hết giờ
    if (r.correct) { sfx.correct(); if (s.combo >= 3) sfx.combo(s.combo); }
    else if (choice === null) sfx.timeout();
    else { sfx.wrong(); vibrate(90); }
    setQs((list) => list.map((x, i) => (i === idx ? { ...x, answer: r.answer, explain: r.explain, explainStatus: r.explainStatus } : x)));
    setPending(undefined);
    setSelected(choice);
    setRevealed(true);
    setGain({ points: s.points, speedBonus: s.speedBonus, comboBonus: s.comboBonus, comboBefore: combo });
    setCombo(s.combo);
    setMaxStreak((m) => Math.max(m, s.combo));
    setScore((v) => v + s.points);
    setAnswers((a) => [...a, { questionId: q.id, selected: choice, correct: r.correct, timeMs, points: s.points, comboAfter: s.combo }]);
  }, [revealed, q, idx, config.mode, config.level, combo, toast]);

  // Vòng lặp đồng hồ
  useEffect(() => {
    if (!running) return;
    lastTick.current = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      qElapsed.current += now - lastTick.current;
      lastTick.current = now;
      if (arena) {
        const left = Math.max(0, limitMs - qElapsed.current);
        setTimeLeft(left);
        if (left <= 0) void reveal(null);
      } else force((n) => n + 1);
    }, 100);
    return () => window.clearInterval(id);
  }, [running, arena, limitMs, reveal]);

  // Ghi nhận thời gian tạm dừng để không tính vào tổng thời gian
  useEffect(() => {
    const isPaused = paused || confirmExit;
    if (isPaused && pauseStarted.current === null) pauseStarted.current = Date.now();
    if (!isPaused && pauseStarted.current !== null) { pausedMs.current += Date.now() - pauseStarted.current; pauseStarted.current = null; }
  }, [paused, confirmExit]);

  const next = useCallback(() => {
    if (!revealed) return;
    if (isLast) {
      const correct = answers.filter((a) => a.correct).length;
      onFinish({
        id: uid(), date: Date.now(), player: round.player, className: round.className,
        config, questions: qs, answers, correct, total: qs.length, score, maxStreak,
        durationMs: Date.now() - roundStart.current - pausedMs.current, isRetry: round.isRetry,
      });
      return;
    }
    sfx.next();
    setIdx((i) => i + 1);
    revealedRef.current = false;
    setSelected(null);
    setRevealed(false);
    setGain(null);
    qElapsed.current = 0;
    setTimeLeft(limitMs);
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [revealed, isLast, answers, onFinish, round, config, qs, score, maxStreak, limitMs, reduce]);

  // Bàn phím: 1–4 / A–D chọn, Enter / → câu tiếp, P tạm dừng, Esc thoát
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (paused || confirmExit || reporting) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea")) return;
      const k = e.key.toLowerCase();
      if (checking) return;
      if (!revealed) {
        const n = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "abcd".indexOf(k);
        if (n >= 0 && n < q.options.length) { e.preventDefault(); void reveal(n); return; }
      } else if (k === "enter" || k === "arrowright") {
        if (t.tagName === "BUTTON" && k === "enter") return; // để nút tự xử lý
        e.preventDefault(); next(); return;
      }
      if (k === "p") setPaused(true);
      if (k === "escape") setConfirmExit(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, checking, paused, confirmExit, reporting, q, reveal, next]);

  if (!q) return null;
  const g = GRADES[config.grade];
  const correct = revealed && selected === q.answer;
  const timedOut = revealed && selected === null;
  const longOpts = q.options.some((o) => o.length > 60);
  const frac = timeLeft / limitMs;

  return (
    <div className="container-arena pb-6 pt-[max(8px,env(safe-area-inset-top))]">
      {/* ================= HUD ================= */}
      <Card data-quiz-header className="!rounded-[24px] p-3 sm:p-4 mb-3 sm:mb-4 [@media(min-height:560px)]:sticky top-2 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="pill !py-1" style={{ background: g.soft, color: g.ink }}>{g.name.replace("KHỐI", "Khối")}</span>
              <SubjectBadge subject={q.subject} size="sm" />
              <span className="hidden md:inline pill !py-1 !bg-slate-100 !text-ink-2">{LEVELS[config.level].label} · {arena ? "Thi đấu" : "Luyện tập"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <SoundToggle className="!size-11" />
            <IconButton icon={Flag} label="Báo lỗi câu hỏi" onClick={() => setReporting(q)} className="!size-11" />
            <IconButton icon={Pause} label="Tạm dừng (phím P)" onClick={() => setPaused(true)} className="!size-11" />
            <IconButton icon={LogOut} label="Thoát lượt chơi" onClick={() => setConfirmExit(true)} className="!size-11" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="font-extrabold text-ink text-[var(--fs-small)]">
                Câu <span className="text-sky-brand text-[1.2em]">{idx + 1}</span> / {questions.length}
              </span>
              <span className="text-xs font-semibold text-ink-3">{answers.filter((a) => a.correct).length} đúng</span>
            </div>
            <ProgressBar value={idx + (revealed ? 1 : 0)} max={questions.length} label="Tiến độ lượt chơi" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1.5 rounded-2xl bg-amber-50 border border-amber-200 px-2.5 sm:px-3 min-h-11" aria-label={`Điểm: ${score}`}>
              <Star className="size-4 sm:size-5 text-gold fill-amber-300" aria-hidden />
              <CountUp value={score} duration={0.6} className="font-black text-amber-900 tabular-nums text-[clamp(.95rem,.9rem+.3vw,1.3rem)]" />
            </div>
            <motion.div
              key={combo}
              initial={reduce || combo < 2 ? false : { scale: 1.35 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className={cx("flex items-center gap-1 rounded-2xl px-2.5 sm:px-3 min-h-11 border transition-colors",
                combo >= 2 ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-slate-50 border-slate-200 text-ink-3")}
              aria-label={`Chuỗi đúng: ${combo}`}
            >
              <Flame className={cx("size-4 sm:size-5", combo >= 2 ? "text-orange-500 fill-orange-300" : "")} aria-hidden />
              <span className="font-black tabular-nums text-[clamp(.95rem,.9rem+.3vw,1.3rem)]">{combo}</span>
              <span className="hidden sm:inline text-xs font-bold">combo</span>
            </motion.div>
            {arena && <TimerRing frac={frac} seconds={Math.ceil(timeLeft / 1000)} paused={!running && !revealed} />}
          </div>
        </div>
      </Card>

      {/* ================= Câu hỏi ================= */}
      <div className={cx("transition-[filter] duration-300", paused && arena && "blur-lg pointer-events-none")} aria-hidden={paused && arena}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={q.id + idx}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <Card className="relative overflow-hidden px-5 py-6 sm:px-8 sm:py-9 mb-3 sm:mb-4">
              <span aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(2,132,199,.12),transparent_70%)]" />
              <div className="relative flex flex-wrap items-center gap-2 mb-3">
                <span className="font-black text-sky-brand text-[var(--fs-small)] tracking-wider">CÂU {idx + 1}</span>
                {q.topic && <span className="text-[var(--fs-small)] text-ink-3 font-semibold">· {q.topic}</span>}
              </div>
              <h2 className="relative font-bold text-ink text-[length:var(--fs-q)] leading-[1.38] text-pretty break-words" id="q-text">
                <MathText text={q.q} />
              </h2>
            </Card>

            <div role="group" aria-labelledby="q-text" className={cx("grid gap-2.5 sm:gap-3.5", !longOpts && "sm:grid-cols-2")}>
              {q.options.map((opt, i) => (
                <AnswerButton key={i} i={i} text={opt} revealed={revealed} isAnswer={i === q.answer} isSelected={selected === i}
                  pending={pending === i} onPick={() => void reveal(i)} disabled={revealed || paused || checking} reduce={!!reduce} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ================= Phản hồi + giải thích ================= */}
        <AnimatePresence>
          {revealed && gain && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="mt-3 sm:mt-4" aria-live="polite" data-feedback
            >
              <Card className={cx("p-4 sm:p-6 border-2", correct ? "!border-emerald-200" : "!border-amber-200")}>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <FeedbackHead correct={correct} timedOut={timedOut} gain={gain} combo={combo} arena={arena} answerLetter={LETTERS[q.answer ?? 0]} />
                    <div className="mt-3 rounded-2xl bg-sky-50/80 border border-sky-100 p-3.5 sm:p-4">
                      <div className="flex items-center gap-2 font-extrabold text-deep text-[var(--fs-small)] mb-1">
                        <Lightbulb className="size-4.5" aria-hidden /> Giải thích
                        {q.explainStatus === "draft" && <span className="ml-auto text-[11px] font-semibold text-ink-3 bg-white rounded-full px-2 py-0.5 border border-slate-200">bản nháp · chờ GV duyệt</span>}
                      </div>
                      <p className="text-ink leading-relaxed text-[var(--fs-body)]">
                        {q.explain ? <MathText text={q.explain} /> : <span className="text-ink-2">Chưa có giải thích cho câu này. Đáp án đúng là <b>{LETTERS[q.answer ?? 0]}. <MathText text={q.options[q.answer ?? 0]} /></b>.</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!revealed && (
          <p className="hidden md:block mt-4 text-center text-[var(--fs-small)] text-ink-3 font-medium">
            Mẹo: nhấn <span className="kbd">1</span>–<span className="kbd">4</span> hoặc <span className="kbd">A</span>–<span className="kbd">D</span> để chọn · <span className="kbd">P</span> tạm dừng
          </p>
        )}
      </div>

      {/* Nút Câu tiếp luôn dính đáy màn hình (mọi kích thước) — không phải cuộn xuống tìm */}
      <AnimatePresence>
        {revealed && (
          <motion.div className="sticky bottom-0 z-30 mt-2 pb-[max(12px,env(safe-area-inset-bottom))] pt-6 bg-gradient-to-t from-[#eefaff] via-[#eefaff]/90 to-transparent pointer-events-none"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mx-auto max-w-[640px] flex items-center gap-3 pointer-events-auto">
              <Button size="lg" block iconRight={ArrowRight} onClick={next} data-next>{isLast ? "Xem kết quả" : "Câu tiếp"}</Button>
              <span className="max-md:hidden text-xs text-ink-3 font-medium whitespace-nowrap">hoặc <span className="kbd">Enter</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= Hộp thoại ================= */}
      <Modal open={paused} onClose={resume} title="Đang tạm dừng">
        <p className="text-ink-2">
          {arena ? "Đồng hồ đã dừng và câu hỏi được ẩn đi. " : ""}Nghỉ một chút rồi quay lại nhé!
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <MiniStat label="Đã làm" value={`${answers.length}/${questions.length}`} />
          <MiniStat label="Điểm" value={score} />
          <MiniStat label="Combo" value={combo} />
        </div>
        <div className="mt-5 grid gap-2">
          <Button size="lg" icon={Play} onClick={resume} data-autofocus>Tiếp tục</Button>
          <Button variant="danger" icon={LogOut} onClick={() => { setPaused(false); setConfirmExit(true); }}>Thoát lượt chơi</Button>
        </div>
      </Modal>

      <Modal open={confirmExit} onClose={() => setConfirmExit(false)} title="Thoát lượt chơi?">
        <p className="text-ink-2">Bạn đã làm <b>{answers.length}/{questions.length}</b> câu. Nếu thoát bây giờ, kết quả lượt này sẽ <b>không được lưu</b>.</p>
        <div className="mt-5 grid sm:grid-cols-2 gap-2">
          <Button variant="soft" onClick={() => setConfirmExit(false)} data-autofocus>Chơi tiếp</Button>
          <Button variant="danger" icon={LogOut} onClick={onExit}>Thoát</Button>
        </div>
      </Modal>

      <ReportDialog question={reporting} onClose={() => setReporting(null)} />
    </div>
  );
}

/* ---------------------------------------------------------------- */

function AnswerButton({ i, text, revealed, isAnswer, isSelected, pending, onPick, disabled, reduce }: {
  i: number; text: string; revealed: boolean; isAnswer: boolean; isSelected: boolean; pending: boolean; onPick: () => void; disabled: boolean; reduce: boolean;
}) {
  const state = !revealed ? "idle" : isAnswer ? (isSelected ? "right" : "missed") : isSelected ? "wrong" : "dim";
  const styles = {
    idle: pending ? "bg-sky-50 border-sky-400" : "bg-white/90 border-white hover:border-sky-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-16px_rgba(2,132,199,.6)]",
    right: "bg-emerald-50 border-emerald-500 shadow-[0_14px_30px_-16px_rgba(5,150,105,.7)]",
    missed: "bg-emerald-50/80 border-emerald-400 border-dashed",
    wrong: "bg-red-50 border-red-500",
    dim: "bg-white/55 border-white opacity-60",
  }[state];
  const badge = {
    idle: "bg-pill text-deep",
    right: "bg-ok text-white",
    missed: "bg-ok text-white",
    wrong: "bg-bad text-white",
    dim: "bg-slate-100 text-ink-3",
  }[state];
  const label = state === "right" ? "Bạn chọn · Đúng" : state === "wrong" ? "Bạn chọn · Sai" : state === "missed" ? "Đáp án đúng" : "";
  return (
    <motion.button
      type="button" onClick={onPick} disabled={disabled}
      aria-label={`${LETTERS[i]}. ${plainMath(text)}${label ? ` — ${label}` : ""}`}
      animate={
        reduce ? undefined :
        state === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } :
        state === "right" ? { scale: [1, 1.035, 1] } : { x: 0, scale: 1 }
      }
      transition={{ duration: 0.45 }}
      className={cx(
        "group relative w-full text-left rounded-[20px] border-2 px-3.5 py-3 sm:px-4 sm:py-4 min-h-16 sm:min-h-20",
        "flex items-center gap-3 sm:gap-4 transition-[background-color,border-color,transform,box-shadow,opacity] duration-200",
        "disabled:cursor-default cursor-pointer", styles,
      )}
    >
      <span className={cx("grid place-items-center size-10 sm:size-12 rounded-[14px] font-black text-[clamp(1rem,.95rem+.3vw,1.35rem)] shrink-0 transition-colors", badge)}>
        {pending ? <Loader2 className="size-6 animate-spin" aria-hidden /> : state === "right" || state === "missed" ? <Check className="size-6" strokeWidth={3.2} aria-hidden /> : state === "wrong" ? <X className="size-6" strokeWidth={3.2} aria-hidden /> : LETTERS[i]}
      </span>
      <span className="flex-1 min-w-0 font-semibold text-ink text-[length:var(--fs-ans)] leading-snug break-words">
        {(state === "right" || state === "missed" || state === "wrong") && <span className="font-black mr-1.5">{LETTERS[i]}.</span>}
        <MathText text={text} />
      </span>
      {label && (
        <span className={cx("hidden sm:inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-bold",
          state === "wrong" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800")}>{label}</span>
      )}
      {state === "right" && !reduce && (
        <motion.span aria-hidden className="absolute inset-0 rounded-[20px] border-4 border-emerald-400"
          initial={{ opacity: 0.8, scale: 1 }} animate={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.7 }} />
      )}
    </motion.button>
  );
}

function FeedbackHead({ correct, timedOut, gain, combo, arena, answerLetter }: {
  correct: boolean; timedOut: boolean; gain: Gain; combo: number; arena: boolean; answerLetter: string;
}) {
  if (correct) {
    return (
      <div className="flex items-start gap-3">
        <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 380, damping: 14 }}
          className="grid place-items-center size-12 rounded-2xl bg-ok text-white shrink-0 shadow-[0_10px_20px_-10px_rgba(5,150,105,.9)]">
          <Check className="size-7" strokeWidth={3.2} aria-hidden />
        </motion.span>
        <div className="min-w-0">
          <div className="font-black text-emerald-800 text-[length:var(--fs-h2)] leading-tight">Chính xác!</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="pill !bg-amber-100 !text-amber-900"><Star className="size-3.5 fill-amber-400 text-amber-600" aria-hidden />+{gain.points} điểm</span>
            {arena && gain.speedBonus > 0 && <span className="pill !bg-sky-50"><Zap className="size-3.5" aria-hidden />Tốc độ +{gain.speedBonus}</span>}
            {combo >= 2 && (
              <motion.span className="pill !bg-orange-100 !text-orange-800" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 12 }}>
                <Flame className="size-3.5 fill-orange-300 text-orange-600" aria-hidden />Chuỗi {combo}{arena && gain.comboBonus ? ` · +${gain.comboBonus}` : ""}
              </motion.span>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <span className="grid place-items-center size-12 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
        {timedOut ? <TimerOff className="size-6" aria-hidden /> : <Sparkles className="size-6" aria-hidden />}
      </span>
      <div className="min-w-0">
        <div className="font-black text-amber-900 text-[length:var(--fs-h2)] leading-tight">{timedOut ? "Hết giờ rồi!" : "Chưa chính xác"}</div>
        <p className="mt-1 text-ink-2 font-medium">
          {timedOut ? "Không sao cả — " : ""}Đáp án đúng là <b className="text-emerald-800">{answerLetter}</b>. Đọc giải thích để ghi nhớ nhé!
        </p>
        {gain.comboBefore >= 2 && (
          <p className="mt-1 text-[var(--fs-small)] text-ink-3 font-medium flex items-center gap-1">
            <Flame className="size-4 shrink-0 text-orange-400" aria-hidden /> Chuỗi {gain.comboBefore} câu đúng đã dừng — bắt đầu chuỗi mới ở câu tiếp theo!
          </p>
        )}
      </div>
    </div>
  );
}

function TimerRing({ frac, seconds, paused }: { frac: number; seconds: number; paused: boolean }) {
  const r = 20, c = 2 * Math.PI * r;
  const color = frac > 0.5 ? "#0284c7" : frac > 0.25 ? "#d97706" : "#dc2626";
  const warn = frac <= 0.25 && seconds > 0 && !paused;
  return (
    <div className={cx("relative size-12 sm:size-14 shrink-0", warn && "tick-warn")} role="timer" aria-label={`Còn ${seconds} giây`}>
      <svg viewBox="0 0 48 48" className="size-full -rotate-90">
        <circle cx="24" cy="24" r={r} fill="white" stroke="#e0f2fe" strokeWidth="5" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - frac)} style={{ transition: "stroke-dashoffset .1s linear, stroke .3s" }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-black tabular-nums text-[clamp(.85rem,.8rem+.3vw,1.15rem)]" style={{ color }}>
        {paused ? <Clock3 className="size-4" aria-hidden /> : seconds}
      </span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-sky-50 border border-sky-100 py-2.5">
      <div className="text-xs font-semibold text-ink-3">{label}</div>
      <div className="font-black text-ink text-lg">{value}</div>
    </div>
  );
}
