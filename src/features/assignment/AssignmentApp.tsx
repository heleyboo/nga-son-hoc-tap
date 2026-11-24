"use client";
import { progressChanged } from "@/features/progress/store";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarClock, Check, ClipboardList, Clock, Loader2, RotateCcw, Send, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MathText } from "@/features/arena/components/MathText";
import { TopBar } from "@/features/arena/components/TopBar";
import { Button, Confetti, cx, StickyActions } from "@/features/arena/components/ui";
import { useIsClient } from "@/features/arena/lib/client";
import { useSession } from "@/features/arena/lib/session";
import { postJson, setUrlParam, store, useUrlParam } from "@/features/live/shared";
import { SoundToggle } from "@/features/arena/components/SoundToggle";
import { sfx, vibrate } from "@/lib/sfx";

interface Info {
  code: string; title: string; note: string | null; grade: number; level: string; mode: "practice" | "test";
  timeLimitMin: number | null; dueAt: number | null; closed: boolean;
  questions: { id: number; subject: string; content: string; options: string[] }[];
}
interface Checked { correct: boolean; answerIndex: number; explanation: string | null; explanationReviewed: boolean }
interface Result {
  correct: number; total: number; score10: number;
  details: { questionId: number; selectedIndex: number | null; answerIndex: number; isCorrect: boolean; explanation: string | null; explanationReviewed: boolean }[];
}
interface Progress { name: string; className: string; startedAt: number; answers: Record<number, number>; checked: Record<number, Checked> }

const LETTERS = "ABCDEF";
const fmtDue = (ms: number) => new Date(ms).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });

/** Trang học sinh làm bài giao: /bai-tap?ma=XXXXXX */
export function AssignmentApp() {
  const isClient = useIsClient();
  const code = useUrlParam("ma")?.toUpperCase() ?? null;
  return (
    <>
      <TopBar brand={{ title: "BÀI TẬP", subtitle: "Web Học Tập THCS Nga Sơn", href: "/" }} />
      <main className="container-arena pb-8 max-w-3xl">
        {!isClient ? <div className="h-40" /> : !code ? <EnterCode /> : <Assignment key={code} code={code} />}
      </main>
    </>
  );
}

function EnterCode() {
  const [v, setV] = useState("");
  const ok = /^[A-Z0-9]{6}$/.test(v);
  return (
    <form className="glass max-w-md mx-auto mt-8 p-6 text-center" onSubmit={(e) => { e.preventDefault(); if (ok) setUrlParam("ma", v); }}>
      <ClipboardList className="size-10 mx-auto text-sky-brand" aria-hidden />
      <h1 className="mt-2 font-black text-2xl text-ink">Nhập mã bài tập</h1>
      <p className="text-ink-2">Mã gồm 6 ký tự do thầy cô gửi.</p>
      <label htmlFor="acode" className="sr-only">Mã bài tập</label>
      <input id="acode" autoFocus maxLength={6} value={v} onChange={(e) => setV(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="ABC123"
        className="mt-4 w-full text-center font-black tracking-[.3em] text-3xl py-3 rounded-2xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none text-deep placeholder:text-slate-300 uppercase" />
      <Button type="submit" size="lg" block className="mt-4" disabled={!ok} iconRight={ArrowRight}>Mở bài</Button>
    </form>
  );
}

function Assignment({ code }: { code: string }) {
  const { me } = useSession();
  const key = `assign:${code}`;
  const [info, setInfo] = useState<Info | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [p, setP] = useState<Progress | null>(() => store.get<Progress>("local", key));
  const [i, setI] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(() => store.get<{ name: string; className: string }>("local", "live-last-name")?.name ?? "");
  const [cls, setCls] = useState(() => store.get<{ name: string; className: string }>("local", "live-last-name")?.className ?? "");

  useEffect(() => {
    fetch(`/api/bai-tap/${code}`, { cache: "no-store" }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Không mở được bài");
      setInfo(d);
    }).catch((e: Error) => setErr(e.message));
  }, [code]);

  const save = useCallback((next: Progress | null) => {
    setP(next);
    if (next) store.set("local", key, next); else store.del("local", key);
  }, [key]);

  const submit = useCallback(async () => {
    if (!info || !p) return;
    setBusy(true);
    try {
      const r = await postJson<Result>(`/api/bai-tap/${code}/submit`, {
        name: p.name, className: p.className || null, durationSec: (Date.now() - p.startedAt) / 1000,
        answers: info.questions.map((q) => ({ questionId: q.id, selectedIndex: p.answers[q.id] ?? null })),
      });
      setResult(r);
      save(null);
      progressChanged();
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }, [info, p, code, save]);

  // hết giờ → tự nộp
  const deadline = info?.timeLimitMin && p ? p.startedAt + info.timeLimitMin * 60_000 : null;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!deadline || result) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [deadline, result]);
  const left = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null;
  useEffect(() => { if (left !== null && left >= 1 && left <= 5 && !result) sfx.tick(left); }, [left, result]);
  const autoSent = useRef(false);
  useEffect(() => {
    if (left === 0 && !autoSent.current && !result) { autoSent.current = true; void submit(); }
  }, [left, result, submit]);

  if (err && !info) return <Notice title="Không mở được bài" text={err} />;
  if (!info) return <div className="py-20 grid place-items-center"><Loader2 className="size-8 animate-spin text-sky-brand" aria-hidden /></div>;
  if (result) return <ResultView info={info} r={result} onRetry={info.closed ? undefined : () => { setResult(null); setI(0); autoSent.current = false; }} />;
  if (info.closed && !p) return <Notice title={info.title} text="Bài tập đã đóng hoặc đã quá hạn nộp." />;

  /* ---------- màn bắt đầu ---------- */
  if (!p) {
    const shownName = me?.nickname ?? name;
    return (
      <div className="glass mt-4 p-6 sm:p-8">
        <p className="pill">Khối {info.grade} · {info.level === "basic" ? "Cơ bản" : "Nâng cao"} · {info.mode === "test" ? "Kiểm tra" : "Luyện tập"}</p>
        <h1 className="mt-3 font-black text-[length:var(--fs-h1)] leading-tight text-ink">{info.title}</h1>
        {info.note && <p className="mt-2 text-ink-2 whitespace-pre-line">{info.note}</p>}
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-ink-2 font-semibold">
          <li>{info.questions.length} câu</li>
          <li className="inline-flex items-center gap-1"><Clock className="size-4" aria-hidden /> {info.timeLimitMin ? `${info.timeLimitMin} phút` : "Không giới hạn thời gian"}</li>
          {info.dueAt && <li className="inline-flex items-center gap-1"><CalendarClock className="size-4" aria-hidden /> Hạn nộp {fmtDue(info.dueAt)}</li>}
        </ul>
        <p className="mt-2 text-sm text-ink-3">{info.mode === "test" ? "Bạn có thể quay lại sửa câu trả lời trước khi nộp. Đáp án hiện sau khi nộp." : "Sau mỗi câu sẽ biết đúng/sai và xem giải thích."}</p>
        <form className="mt-5 grid sm:grid-cols-[1fr_140px] gap-3" onSubmit={(e) => {
          e.preventDefault();
          if (!shownName.trim()) return;
          store.set("local", "live-last-name", { name: shownName, className: me?.className ?? cls });
          save({ name: shownName.trim(), className: (me?.className ?? cls).trim(), startedAt: Date.now(), answers: {}, checked: {} });
        }}>
          {me ? <p className="sm:col-span-2 font-semibold text-ink">Làm bài với tên <b>{me.nickname}</b>{me.className ? ` · lớp ${me.className}` : ""}</p> : (<>
            <label><span className="text-sm font-bold text-ink-2">Họ tên</span>
              <input required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-4 min-h-12 rounded-2xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none font-bold" /></label>
            <label><span className="text-sm font-bold text-ink-2">Lớp</span>
              <input maxLength={20} value={cls} onChange={(e) => setCls(e.target.value)} placeholder="7A" className="mt-1 w-full px-4 min-h-12 rounded-2xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none font-bold" /></label>
          </>)}
          <Button type="submit" size="lg" className="sm:col-span-2" iconRight={ArrowRight} disabled={!shownName.trim()}>Bắt đầu làm bài</Button>
        </form>
      </div>
    );
  }

  /* ---------- làm bài ---------- */
  const q = info.questions[i];
  const chosen = p.answers[q.id];
  const checked = p.checked[q.id];
  const answeredCount = info.questions.filter((x) => p.answers[x.id] !== undefined).length;
  const choose = async (k: number) => {
    if (info.mode === "practice" && checked) return;
    sfx.tap();
    const next = { ...p, answers: { ...p.answers, [q.id]: k } };
    save(next);
    if (info.mode === "practice") {
      try {
        const c = await postJson<Checked>(`/api/bai-tap/${code}/check`, { questionId: q.id, selectedIndex: k });
        save({ ...next, checked: { ...next.checked, [q.id]: c } });
        if (c.correct) sfx.correct(); else { sfx.wrong(); vibrate(90); }
      } catch { /* vẫn chấm khi nộp */ }
    }
  };
  const last = i === info.questions.length - 1;

  return (
    <div className="mt-3 space-y-3">
      <div className="glass !rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3">
        <p className="font-black text-ink flex-1 min-w-0 truncate">{info.title}</p>
        <span className="font-bold text-ink-2">{answeredCount}/{info.questions.length} đã làm</span>
        <SoundToggle className="!size-10" />
        {left !== null && <span className={cx("pill !bg-white font-black tabular-nums", left <= 60 && "!text-bad")}><Clock className="size-4" aria-hidden /> {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span>}
      </div>

      <nav aria-label="Chọn câu" className="flex flex-wrap gap-1.5">
        {info.questions.map((x, k) => {
          const c = p.checked[x.id];
          return (
            <button key={x.id} onClick={() => setI(k)} aria-current={k === i ? "step" : undefined} aria-label={`Câu ${k + 1}`}
              className={cx("size-10 rounded-xl font-black text-sm border-2 cursor-pointer",
                k === i ? "border-sky-brand" : "border-transparent",
                c ? (c.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800") : p.answers[x.id] !== undefined ? "bg-sky-100 text-deep" : "bg-white/80 text-ink-3")}>
              {k + 1}
            </button>
          );
        })}
      </nav>

      <motion.div key={q.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="glass p-5 sm:p-6">
        <p className="text-sm font-bold text-ink-3">Câu {i + 1}/{info.questions.length} · {q.subject}</p>
        <MathText text={q.content} className="mt-2 block font-bold text-ink text-[clamp(1.05rem,1rem+.4vw,1.35rem)] leading-snug" />
        <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Các đáp án">
          {q.options.map((o, k) => {
            const sel = chosen === k;
            const right = checked && checked.answerIndex === k;
            const wrong = checked && sel && !checked.correct;
            return (
              <button key={k} role="radio" aria-checked={sel} onClick={() => void choose(k)} disabled={!!checked}
                className={cx("flex items-start gap-3 text-left min-h-14 px-4 py-3 rounded-2xl border-2 font-semibold transition cursor-pointer disabled:cursor-default",
                  right ? "bg-emerald-50 border-emerald-500 text-emerald-900" : wrong ? "bg-red-50 border-red-400 text-red-900"
                    : sel ? "bg-white border-sky-brand text-ink shadow-[0_10px_24px_-14px_rgba(2,132,199,.6)]" : "bg-white/80 border-sky-100 text-ink hover:bg-white")}>
                <span className={cx("grid place-items-center size-8 rounded-lg font-black shrink-0", sel || right ? "bg-sky-brand text-white" : "bg-sky-50 text-deep", right && "!bg-emerald-600", wrong && "!bg-red-600")}>{LETTERS[k]}</span>
                <MathText text={o} className="pt-1" />
                {right && <Check className="ml-auto size-5 shrink-0 mt-1" aria-label="Đáp án đúng" />}
                {wrong && <X className="ml-auto size-5 shrink-0 mt-1" aria-label="Sai" />}
              </button>
            );
          })}
        </div>
        {checked?.explanation && (
          <div className="mt-4 rounded-2xl bg-sky-50 border border-sky-100 p-4 text-ink-2">
            <p className="text-sm font-bold text-ink-3">{checked.explanationReviewed ? "Giải thích" : "Gợi ý giải thích (bản nháp)"}</p>
            <MathText text={checked.explanation} />
          </div>
        )}
      </motion.div>

      {err && <p role="alert" className="font-bold text-bad">{err}</p>}
      <StickyActions>
        <Button variant="soft" icon={ArrowLeft} disabled={i === 0} onClick={() => setI(i - 1)} aria-label="Câu trước"><span className="max-sm:hidden">Câu trước</span></Button>
        <span className="flex-1 text-center font-bold text-ink-3 tabular-nums">{i + 1}/{info.questions.length}</span>
        {!last && <Button variant="soft" iconRight={ArrowRight} onClick={() => setI(i + 1)} aria-label="Câu sau"><span className="max-sm:hidden">Câu sau</span></Button>}
        {(last || answeredCount === info.questions.length) && (
          <Button icon={busy ? Loader2 : Send} disabled={busy} onClick={() => {
            const missing = info.questions.length - answeredCount;
            if (missing > 0 && !busy) { setErr(`Còn ${missing} câu chưa làm — bấm "Nộp bài" lần nữa để nộp luôn.`); if (err?.startsWith("Còn")) void submit(); return; }
            void submit();
          }}>Nộp bài</Button>
        )}
      </StickyActions>
    </div>
  );
}

function ResultView({ info, r, onRetry }: { info: Info; r: Result; onRetry?: () => void }) {
  const great = r.score10 >= 8;
  useEffect(() => { if (great) sfx.fanfare(); else sfx.finish(); }, [great]);
  const byId = new Map(info.questions.map((q) => [q.id, q]));
  return (
    <div className="mt-4 space-y-4">
      <Confetti run={great} />
      <div className="glass p-6 sm:p-8 text-center">
        <p className="font-bold text-ink-2">{info.title}</p>
        <p className="mt-2 font-black text-[clamp(3.5rem,3rem+3vw,6rem)] leading-none title-gradient tabular-nums">{r.score10.toLocaleString("vi-VN")}<span className="text-2xl text-ink-3">/10</span></p>
        <p className="mt-2 font-bold text-ink">Đúng {r.correct}/{r.total} câu · Đã gửi kết quả cho thầy cô</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {onRetry && <Button variant="soft" icon={RotateCcw} onClick={onRetry}>Làm lại</Button>}
          <Link href="/" className="inline-flex items-center min-h-12 px-5 rounded-[var(--radius-ctl)] font-extrabold text-deep bg-white/90 border border-sky-100">Về trang chủ</Link>
        </div>
      </div>
      <section className="glass p-5 sm:p-6">
        <h2 className="font-black text-ink text-lg">Xem lại bài làm</h2>
        <ol className="mt-3 space-y-4">
          {r.details.map((d, k) => {
            const q = byId.get(d.questionId);
            if (!q) return null;
            return (
              <li key={d.questionId} className={cx("rounded-2xl border-2 p-4", d.isCorrect ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/40")}>
                <p className="text-sm font-bold text-ink-3 inline-flex items-center gap-1.5">
                  {d.isCorrect ? <Check className="size-4 text-ok" aria-hidden /> : <X className="size-4 text-bad" aria-hidden />} Câu {k + 1} · {d.isCorrect ? "Đúng" : d.selectedIndex === null ? "Bỏ trống" : "Sai"}
                </p>
                <MathText text={q.content} className="mt-1 block font-bold text-ink" />
                <ul className="mt-2 space-y-1 text-sm">
                  {q.options.map((o, i) => (
                    <li key={i} className={cx("flex gap-1.5", i === d.answerIndex ? "text-ok font-bold" : i === d.selectedIndex ? "text-bad font-semibold" : "text-ink-2")}>
                      <span className="w-4 shrink-0">{LETTERS[i]}.</span><MathText text={o} className={i === d.selectedIndex && i !== d.answerIndex ? "line-through" : undefined} />
                      {i === d.selectedIndex && <span className="text-xs font-bold shrink-0 mt-0.5">(bạn chọn)</span>}
                    </li>
                  ))}
                </ul>
                {d.explanation && <p className="mt-2 text-sm text-ink-2"><b>{d.explanationReviewed ? "Giải thích: " : "Gợi ý (bản nháp): "}</b><MathText text={d.explanation} /></p>}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div className="glass max-w-md mx-auto mt-8 p-7 text-center">
      <p className="font-black text-xl text-ink">{title}</p>
      <p className="mt-2 text-ink-2">{text}</p>
      <Button className="mt-5" variant="soft" onClick={() => setUrlParam("ma", null)}>Nhập mã khác</Button>
    </div>
  );
}
