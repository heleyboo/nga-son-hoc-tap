import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Check, Home, MessageSquareHeart, Send, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Button, Card, Note, ScreenTitle, cx, StickyActions } from "../components/ui";
import { GRADES, LEVELS } from "../data/meta";
import type { Grade, Level } from "../data/types";
import { useToast } from "../components/Toast";
import { fetchFeedbackSummary, sendFeedback } from "../lib/api";

type Difficulty = "easy" | "medium" | "hard" | null;

const TAGS = ["Hay", "Câu hỏi rõ ràng", "Vừa sức", "Quá khó", "Quá dễ", "Muốn thêm câu", "Giải thích dễ hiểu", "Phát hiện câu sai đáp án"];
const DIFF = [
  { k: "easy", label: "Dễ", emoji: "🌱" },
  { k: "medium", label: "Vừa", emoji: "👍" },
  { k: "hard", label: "Khó", emoji: "🔥" },
] as const;
const STAR_LABEL = ["", "Chưa hài lòng", "Tạm được", "Khá ổn", "Rất hay", "Tuyệt vời!"];
const DRAFT_KEY = "dttt.v1.feedback-draft";

export function Feedback({ player, context, onBack, onHome, forceThanks }: {
  player: string; context: { grade?: Grade; level?: Level; attemptId?: number } | null; onBack: () => void; onHome: () => void; forceThanks?: boolean;
}) {
  const reduce = useReducedMotion();
  const draft = useMemo(() => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch { return null; } }, []);
  const [rating, setRating] = useState<number>(draft?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [diff, setDiff] = useState<Difficulty>(draft?.diff ?? null);
  const [tags, setTags] = useState<string[]>(draft?.tags ?? []);
  const [comment, setComment] = useState<string>(draft?.comment ?? "");
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const snapshot = JSON.stringify({ rating, diff, tags, comment });
  const draftSaved = savedSnapshot === snapshot && !!(rating || diff || tags.length || comment);
  const [sent, setSent] = useState<null | { delivered: boolean }>(forceThanks ? { delivered: true } : null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Tự lưu nháp trên máy (tiện ích cá nhân, không phải dữ liệu chính)
  useEffect(() => {
    if (sent) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, snapshot);
        setSavedSnapshot(snapshot);
      } catch { /* bỏ qua */ }
    }, 500);
    return () => clearTimeout(t);
  }, [snapshot, sent]);

  const submit = async () => {
    if (!rating) return;
    setBusy(true);
    try {
      await sendFeedback({
        playerName: player || undefined, grade: context?.grade, level: context?.level, attemptId: context?.attemptId,
        rating, difficulty: diff ?? undefined, tags, comment: comment.trim() || undefined,
      });
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* bỏ qua */ }
      setSent({ delivered: true });
    } catch {
      // Không mất dữ liệu: nháp vẫn được giữ trên máy để gửi lại
      toast("Chưa gửi được góp ý — nháp vẫn được giữ, thử lại sau nhé.", "info");
    } finally {
      setBusy(false);
    }
  };

  const onStarKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); const v = Math.min(5, (rating || 0) + 1); setRating(v); starRefs.current[v - 1]?.focus(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); const v = Math.max(1, (rating || 2) - 1); setRating(v); starRefs.current[v - 1]?.focus(); }
  };

  if (sent) return <Thanks delivered={sent.delivered} onBack={onBack} onHome={onHome} reduce={!!reduce} />;

  const shown = hover || rating;
  const ctxLabel = context?.grade ? `${GRADES[context.grade].name}${context.level ? ` · ${LEVELS[context.level].label}` : ""}` : "Đấu Trường Tri Thức";

  return (
    <div className="container-arena pb-12 max-w-[760px]">
      <ScreenTitle eyebrow={<span className="pill"><MessageSquareHeart className="size-4" aria-hidden /> {ctxLabel}</span>}
        title="Nhận xét & đánh giá" sub="Ý kiến của bạn giúp thầy cô làm bộ đề hay hơn." />
      <Card className="p-5 sm:p-8 grid gap-7">
        <fieldset>
          <legend className="font-extrabold text-ink mb-3">Bạn chấm bộ đề này mấy sao? <span className="text-bad" aria-hidden>*</span></legend>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div role="radiogroup" aria-label="Số sao" className="flex gap-1.5" onKeyDown={onStarKey} onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.button key={n} ref={(el) => { starRefs.current[n - 1] = el; }}
                  type="button" role="radio" aria-checked={rating === n} aria-label={`${n} sao – ${STAR_LABEL[n]}`}
                  tabIndex={rating ? (rating === n ? 0 : -1) : n === 1 ? 0 : -1}
                  onClick={() => setRating(n)} onMouseEnter={() => setHover(n)}
                  whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.12 }}
                  className="grid place-items-center size-12 sm:size-14 rounded-2xl cursor-pointer">
                  <Star className={cx("size-9 sm:size-11 transition-colors", n <= shown ? "fill-amber-400 text-amber-500" : "text-slate-300")} strokeWidth={1.8} aria-hidden />
                </motion.button>
              ))}
            </div>
            <span className="font-bold text-amber-800 min-h-6" aria-live="polite">{STAR_LABEL[shown]}</span>
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-extrabold text-ink mb-3">Độ khó của bộ đề</legend>
          <div role="radiogroup" aria-label="Độ khó" className="grid grid-cols-3 gap-2">
            {DIFF.map((d) => (
              <button key={d.k} type="button" role="radio" aria-checked={diff === d.k} onClick={() => setDiff(d.k)}
                className={cx("min-h-14 rounded-[18px] border-2 font-extrabold cursor-pointer transition-colors flex items-center justify-center gap-2",
                  diff === d.k ? "border-sky-brand bg-sky-50 text-deep" : "border-sky-100 bg-white/90 text-ink-2 hover:bg-white hover:border-sky-200")}>
                <span aria-hidden>{d.emoji}</span> {d.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-extrabold text-ink mb-3">Cảm nhận nhanh <span className="font-medium text-ink-3 text-[var(--fs-small)]">(chọn nhiều)</span></legend>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const on = tags.includes(t);
              return (
                <motion.button key={t} type="button" role="checkbox" aria-checked={on} whileTap={{ scale: 0.94 }}
                  onClick={() => setTags((s) => (on ? s.filter((x) => x !== t) : [...s, t]))}
                  className={cx("inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-full border-2 font-semibold text-[var(--fs-small)] cursor-pointer transition-colors",
                    on ? "bg-emerald-50 border-emerald-brand text-emerald-900" : "bg-white/90 border-sky-100 text-ink-2 hover:bg-white hover:border-sky-200")}>
                  {on && <Check className="size-4" strokeWidth={3} aria-hidden />} {t}
                </motion.button>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="block font-extrabold text-ink mb-2">Nhận xét thêm <span className="font-medium text-ink-3 text-[var(--fs-small)]">(không bắt buộc)</span></span>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} rows={4}
            placeholder="Bạn thích điều gì? Muốn thầy cô bổ sung chủ đề nào?"
            className="w-full rounded-[20px] border-2 border-sky-100 bg-white p-4 text-ink focus:border-sky-brand focus:outline-none resize-y" />
          <span className="mt-1 flex justify-between text-xs font-medium text-ink-3">
            <span aria-live="polite">{draftSaved ? "✓ Đã lưu nháp trên máy này" : " "}</span>
            <span>{comment.length}/500</span>
          </span>
        </label>

        <Note tone="emerald" icon={Send}>Góp ý được gửi lên hệ thống của trường để thầy cô đọc và cải thiện bộ đề.</Note>

      </Card>
      <StickyActions inner="justify-between">
        <Button variant="soft" icon={ArrowLeft} onClick={onBack}>Quay lại</Button>
        <span className="flex-1 text-right text-xs text-ink-3 font-medium max-sm:hidden">{!rating ? "Chọn số sao để gửi góp ý" : ""}</span>
        <Button size="lg" icon={Send} onClick={submit} disabled={!rating || busy} title={!rating ? "Chọn số sao để gửi góp ý" : undefined}>{busy ? "Đang gửi…" : "Gửi góp ý"}</Button>
      </StickyActions>
      <RecentFeedback />
    </div>
  );
}

function Thanks({ delivered, onBack, onHome, reduce }: { delivered: boolean; onBack: () => void; onHome: () => void; reduce: boolean }) {
  return (
    <div className="container-arena pb-12 max-w-[640px]">
      <Card className="p-7 sm:p-10 text-center relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,.18),transparent_60%)]" />
        <motion.div className="relative mx-auto grid place-items-center size-24 rounded-full btn-primary"
          initial={reduce ? false : { scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 12 }}>
          <Check className="size-12" strokeWidth={3.2} aria-hidden />
        </motion.div>
        <h1 className="relative mt-5 font-black uppercase text-[length:var(--fs-h1)] title-gradient">Cảm ơn bạn đã góp ý!</h1>
        <p className="relative mt-2 text-ink-2">Mỗi ý kiến đều giúp Đấu Trường Tri Thức tốt hơn cho các bạn học sinh Nga Sơn.</p>
        <div className="relative mt-5 inline-flex">
          {delivered && <Note tone="emerald" icon={Send}>Đã gửi tới thầy cô.</Note>}
        </div>
        <div className="relative mt-6 grid sm:grid-cols-2 gap-2">
          <Button variant="soft" icon={ArrowLeft} onClick={onBack}>Quay lại</Button>
          <Button icon={Home} onClick={onHome}>Về trang chủ</Button>
        </div>
      </Card>
      <RecentFeedback />
    </div>
  );
}

function RecentFeedback() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchFeedbackSummary>> | null>(null);
  useEffect(() => { fetchFeedbackSummary().then(setData).catch(() => setData(null)); }, []);
  if (!data || !data.total) return null;
  return (
    <Card className="mt-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="font-extrabold text-ink">Nhận xét gần đây</h2>
        {data.avgRating !== null && (
          <span className="pill !bg-amber-50 !text-amber-900"><Star className="size-4 fill-amber-400 text-amber-500" aria-hidden /> {data.avgRating.toFixed(1)} / 5 · {data.total} lượt</span>
        )}
      </div>
      <ul className="grid gap-2">
        {data.recent.slice(0, 4).map((f, i) => (
          <li key={i} className="rounded-2xl bg-white/70 border border-white p-3">
            <div className="flex items-center gap-2 text-[var(--fs-small)]">
              <span className="flex" aria-label={`${f.rating} sao`}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cx("size-4", n <= f.rating ? "fill-amber-400 text-amber-500" : "text-slate-300")} aria-hidden />)}</span>
              <span className="font-bold text-ink">{f.playerName || "Ẩn danh"}</span>
              <span className="text-ink-3 ml-auto">{new Date(f.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
            {(f.comment || f.tags.length > 0) && <p className="mt-1 text-ink-2 text-[var(--fs-small)]">{f.comment || f.tags.join(" · ")}</p>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
