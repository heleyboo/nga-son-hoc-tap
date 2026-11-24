"use client";
import { progressChanged } from "@/features/progress/store";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Clock, Flame, Loader2, Medal, Play, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleButton } from "@/features/arena/components/GoogleButton";
import { MathText } from "@/features/arena/components/MathText";
import { TopBar } from "@/features/arena/components/TopBar";
import { Button, Confetti, cx, StickyActions } from "@/features/arena/components/ui";
import { GRADES } from "@/features/arena/data/meta";
import type { Grade } from "@/features/arena/data/types";
import { useIsClient } from "@/features/arena/lib/client";
import { useSession } from "@/features/arena/lib/session";
import { postJson, store } from "@/features/live/shared";
import { SoundToggle } from "@/features/arena/components/SoundToggle";
import { sfx, vibrate } from "@/lib/sfx";
import { ShareButton } from "@/features/share/ShareButton";

/* ---------- kiểu dữ liệu từ API ---------- */
interface RunView {
  runId: number; token?: string; date: string; grade: number; ranked: boolean; total: number; current: number; finished: boolean;
  score: number; correct: number; streak: number; serverNow: number; resetAt: number; resumed?: boolean;
  question: { index: number; subject: string; level: string; content: string; options: string[]; seconds: number; deadline: number | null } | null;
  review: { content: string; options: string[]; subject: string; choice: number | null; answerIndex: number; correct: boolean; points: number; explanation: string | null; explanationReviewed: boolean }[];
}
interface MeInfo {
  today: string; resetAt: number; serverNow: number; signedIn: boolean; suggestedGrade: number | null;
  stats: { days: { date: string; score: number; correct: number; grade: number }[]; current: number; best: number; playedToday: boolean } | null;
}
interface Board { total: number; items: { rank: number; name: string; className: string | null; score: number; correct: number; isMe: boolean }[]; me: { rank: number; score: number } | null }
interface Saved { runId: number; token: string; grade: number }

const LETTERS = "ABCDEF";
const DAY = 86400000;
const addDays = (d: string, n: number) => new Date(Date.parse(d + "T00:00:00Z") + n * DAY).toISOString().slice(0, 10);

/** Chuỗi ngày của khách lưu trên máy */
function localStreak(days: string[], today: string) {
  const set = new Set(days);
  let cur = 0, d = set.has(today) ? today : addDays(today, -1);
  while (set.has(d)) { cur++; d = addDays(d, -1); }
  let best = 0, run = 0, last: string | null = null;
  for (const x of [...set].sort()) { run = last && addDays(last, 1) === x ? run + 1 : 1; best = Math.max(best, run); last = x; }
  return { current: cur, best, playedToday: set.has(today) };
}

export function DailyApp() {
  const isClient = useIsClient();
  return (
    <>
      <TopBar brand={{ title: "THỬ THÁCH NGÀY", subtitle: "Web Học Tập THCS Nga Sơn", href: "/" }} />
      <main className="container-arena pb-8 max-w-4xl">{isClient ? <Daily /> : <div className="h-60" />}</main>
    </>
  );
}

function Daily() {
  const { me: user, ready, googleEnabled, signIn } = useSession();
  const [info, setInfo] = useState<MeInfo | null>(null);
  const [grade, setGrade] = useState<Grade | null>(() => store.get<Grade>("local", "daily-grade"));
  const [run, setRun] = useState<RunView | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const loadInfo = useCallback(() => {
    fetch("/api/daily/me", { cache: "no-store" }).then((r) => r.json()).then((d: MeInfo) => { setInfo(d); setOffset(d.serverNow - Date.now()); }).catch(() => {});
  }, []);
  useEffect(() => { if (ready) loadInfo(); }, [ready, user?.id, loadInfo]);

  // ưu tiên: khối đã chọn → khối đã chơi hôm nay → khối theo lớp của tài khoản → 7
  const playedGrade = info?.stats?.days.find((d) => d.date === info.today)?.grade as Grade | undefined;
  const g: Grade = grade ?? playedGrade ?? ((info?.suggestedGrade as Grade | null) ?? 7);
  const savedKey = info ? `daily-run:${info.today}:${user?.id ?? "guest"}` : null;
  const saved = savedKey ? store.get<Saved>("local", savedKey) : null;

  const apply = (v: RunView) => {
    setRun(v);
    setOffset(v.serverNow - Date.now());
    if (v.finished && !v.ranked && info) {
      const days = store.get<string[]>("local", "daily-days") ?? [];
      if (!days.includes(v.date)) store.set("local", "daily-days", [...days, v.date].slice(-200));
    }
  };

  const start = async () => {
    setBusy(true); setErr(null);
    try {
      // khách đang làm dở lượt hôm nay → tiếp tục lượt đó
      if (saved && !user) {
        const r = await fetch(`/api/daily/run?runId=${saved.runId}&token=${encodeURIComponent(saved.token)}`, { cache: "no-store" });
        if (r.ok) { const v = (await r.json()) as RunView; apply({ ...v, token: saved.token }); return; }
      }
      const v = await postJson<RunView>("/api/daily/start", { grade: g });
      if (savedKey && v.token) store.set("local", savedKey, { runId: v.runId, token: v.token, grade: v.grade });
      apply(v);
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };

  if (!info) return <div className="py-24 grid place-items-center"><Loader2 className="size-8 animate-spin text-sky-brand" aria-hidden /></div>;

  if (run && run.token) {
    return run.finished
      ? <Finished run={run} info={info} onBack={() => { setRun(null); loadInfo(); }} />
      : <Playing run={run} token={run.token} offset={offset} onUpdate={(v) => apply({ ...v, token: run.token })} />;
  }

  const stats = info.stats ?? localStreak(store.get<string[]>("local", "daily-days") ?? [], info.today);
  const days = info.stats ? info.stats.days.map((d) => d.date) : store.get<string[]>("local", "daily-days") ?? [];
  const doneToday = info.stats ? info.stats.playedToday : days.includes(info.today);

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[30px] p-6 sm:p-8 text-white shadow-[0_30px_60px_-30px_rgba(217,119,6,.8)]"
        style={{ background: "linear-gradient(125deg,#b45309 0%,#d97706 45%,#059669 100%)" }}>
        <div aria-hidden className="absolute -right-10 -top-16 size-64 rounded-full bg-white/10" />
        <div className="relative grid sm:grid-cols-[1fr_auto] gap-5 items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-bold"><Sparkles className="size-4" aria-hidden /> {new Date(info.today + "T00:00:00").toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}</p>
            <h1 className="mt-3 font-black uppercase tracking-tight text-[clamp(1.7rem,1.2rem+2vw,2.8rem)] leading-tight">Thử thách hôm nay</h1>
            <p className="mt-1 text-white/90 font-medium">5 câu · có đếm giờ · cả trường cùng một đề. Thử thách mới sau <Countdown to={info.resetAt} offset={offset} />.</p>
          </div>
          <div className="flex sm:flex-col items-start sm:items-stretch gap-3">
            <div className="rounded-2xl bg-white/15 border border-white/30 px-4 py-3 text-center min-w-28">
              <p className="inline-flex items-center gap-1 font-black text-3xl tabular-nums"><Flame className={cx("size-7", stats.current > 0 ? "text-amber-200" : "text-white/50")} aria-hidden />{stats.current}</p>
              <p className="text-xs font-bold text-white/85">ngày liên tiếp</p>
            </div>
            <div className="self-center sm:self-auto rounded-2xl bg-white/10 px-4 py-2 text-center text-sm font-bold">Kỷ lục: {stats.best} ngày</div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4 items-start">
        <section className="glass p-5 sm:p-6">
          <h2 className="font-black text-ink text-lg">Chọn khối của bạn</h2>
          <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Khối lớp">
            {([6, 7, 8, 9] as Grade[]).map((x) => (
              <button key={x} role="radio" aria-checked={g === x} onClick={() => { setGrade(x); store.set("local", "daily-grade", x); }}
                className={cx("min-h-14 rounded-2xl font-black border-2 transition cursor-pointer", g === x ? "text-white border-transparent" : "bg-white/80 border-sky-100 text-ink-2 hover:bg-white")}
                style={g === x ? { background: `linear-gradient(135deg, ${GRADES[x].from}, ${GRADES[x].to})` } : undefined}>Khối {x}</button>
            ))}
          </div>
          {user && doneToday ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="font-bold text-emerald-900 inline-flex items-center gap-2"><Check className="size-5" aria-hidden /> Bạn đã hoàn thành thử thách hôm nay!</p>
              <p className="text-sm text-emerald-800">Mỗi ngày tính điểm một lượt. Quay lại sau <Countdown to={info.resetAt} offset={offset} /> nhé.</p>
              <Button className="mt-3" variant="soft" onClick={() => void start()} icon={busy ? Loader2 : Trophy} disabled={busy}>Xem lại kết quả</Button>
            </div>
          ) : (
            <Button size="lg" block className="mt-5" icon={busy ? Loader2 : Play} disabled={busy} onClick={() => void start()}>
              {saved && !user ? "Tiếp tục lượt đang làm" : "Bắt đầu thử thách"}
            </Button>
          )}
          {err && <p role="alert" className="mt-3 font-bold text-bad">{err}</p>}
          {ready && !user && (
            <div className="mt-4 rounded-2xl bg-sky-50 border border-sky-100 p-4 text-sm text-ink-2">
              Bạn đang chơi với tư cách khách: chuỗi ngày chỉ lưu trên máy này và không lên bảng xếp hạng.
              {googleEnabled && <GoogleButton className="mt-3 w-full" label="Đăng nhập để giữ chuỗi & lên bảng" onClick={() => void signIn()} />}
            </div>
          )}
          <Calendar days={days} today={info.today} />
        </section>
        <DayBoard grade={g} />
      </div>
    </div>
  );
}

function Countdown({ to, offset }: { to: number; offset: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((to - now - offset) / 1000));
  return <b className="tabular-nums">{String(Math.floor(s / 3600)).padStart(2, "0")}:{String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}</b>;
}

/** Lịch 5 tuần gần nhất: ô xanh = đã hoàn thành thử thách */
function Calendar({ days, today }: { days: string[]; today: string }) {
  const set = new Set(days);
  // bắt đầu từ thứ Hai của tuần cách đây 4 tuần
  const dow = (new Date(today + "T00:00:00Z").getUTCDay() + 6) % 7;
  const first = addDays(today, -dow - 28);
  const cells = Array.from({ length: 35 }, (_, i) => addDays(first, i));
  return (
    <div className="mt-5">
      <h3 className="font-bold text-ink-2 text-sm">5 tuần gần đây</h3>
      <div className="mt-2 grid grid-cols-7 gap-1.5 max-w-sm" role="grid" aria-label="Lịch thử thách">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => <span key={d} className="text-center text-[11px] font-bold text-ink-3">{d}</span>)}
        {cells.map((d) => {
          const done = set.has(d), future = d > today, isToday = d === today;
          return (
            <span key={d} role="gridcell" aria-label={`${d}${done ? ": đã hoàn thành" : ""}`} title={new Date(d + "T00:00:00").toLocaleDateString("vi-VN")}
              className={cx("aspect-square rounded-lg grid place-items-center text-[11px] font-bold",
                done ? "bg-emerald-500 text-white" : future ? "bg-transparent text-slate-300" : "bg-white/80 text-ink-3 border border-sky-100",
                isToday && "ring-2 ring-amber-500 ring-offset-1")}>
              {done ? <Flame className="size-3.5" aria-hidden /> : Number(d.slice(8))}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function DayBoard({ grade }: { grade: Grade }) {
  const [b, setB] = useState<{ grade: number; data: Board } | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () => fetch(`/api/daily/board?grade=${grade}`, { cache: "no-store" }).then((r) => r.json()).then((data: Board) => { if (alive) setB({ grade, data }); }).catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => { alive = false; clearInterval(t); };
  }, [grade]);
  const data = b?.grade === grade ? b.data : null;
  return (
    <section className="glass p-5 sm:p-6">
      <h2 className="font-black text-ink text-lg inline-flex items-center gap-2"><Medal className="size-5 text-gold" aria-hidden /> Bảng xếp hạng hôm nay · Khối {grade}</h2>
      {!data ? <Loader2 className="mt-6 mx-auto size-6 animate-spin text-sky-brand" aria-hidden /> : data.items.length === 0 ? (
        <p className="mt-6 text-center text-ink-3 font-semibold">Chưa có ai hoàn thành. Hãy là người đầu tiên!</p>
      ) : (
        <ol className="mt-3 space-y-1.5">
          {data.items.map((r, i) => (
            <li key={i} className={cx("flex items-center gap-3 rounded-xl px-3 py-2", r.isMe ? "bg-amber-50 border border-amber-200" : "bg-white/70")}>
              <span className={cx("grid place-items-center size-8 rounded-lg font-black text-sm", r.rank === 1 ? "bg-amber-100 text-amber-800" : r.rank === 2 ? "bg-slate-200 text-slate-700" : r.rank === 3 ? "bg-orange-100 text-orange-800" : "bg-sky-50 text-deep")}>{r.rank}</span>
              <span className="flex-1 min-w-0 truncate font-bold text-ink">{r.name}{r.className && <span className="ml-1.5 text-xs text-ink-3">{r.className}</span>}{r.isMe && <span className="ml-1.5 text-xs text-amber-700">(bạn)</span>}</span>
              <span className="text-xs text-ink-3">{r.correct}/5</span>
              <span className="font-black text-deep tabular-nums w-12 text-right">{r.score}</span>
            </li>
          ))}
        </ol>
      )}
      {data?.me && !data.items.some((r) => r.isMe) && <p className="mt-3 text-sm font-bold text-ink-2">Hạng của bạn: {data.me.rank}/{data.total}</p>}
    </section>
  );
}

/* ---------- đang chơi ---------- */
function Playing({ run, token, offset, onUpdate }: { run: RunView; token: string; offset: number; onUpdate: (v: RunView) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const q = run.question;
  const last = run.review.length > run.current - 1 && run.current > 0 ? run.review[run.current - 1] : null;
  // câu vừa trả lời đang chờ bấm "Câu tiếp" khi deadline = null
  const showingFeedback = !!q && q.deadline === null && run.current > 0 && last !== null;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!q?.deadline) return;
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [q?.deadline]);
  const msLeft = q?.deadline ? Math.max(0, q.deadline - (now + offset)) : 0;

  // Âm thanh: phản hồi mỗi khi có thêm một câu được chấm; tích tắc 5 giây cuối
  const answeredCount = run.review.length;
  const heard = useRef(answeredCount);
  useEffect(() => {
    if (answeredCount <= heard.current) return;
    heard.current = answeredCount;
    const r = run.review[answeredCount - 1];
    if (r.correct) { sfx.correct(); if (run.streak >= 3) sfx.combo(run.streak); }
    else if (r.choice === null) sfx.timeout();
    else { sfx.wrong(); vibrate(90); }
  }, [answeredCount, run.review, run.streak]);
  const sec = q?.deadline ? Math.ceil(msLeft / 1000) : 0;
  const ticked = useRef("");
  useEffect(() => {
    if (!q?.deadline || sec < 1 || sec > 5) return;
    const k = `${q.index}:${sec}`;
    if (ticked.current === k) return;
    ticked.current = k;
    sfx.tick(sec);
  }, [q?.deadline, q?.index, sec]);

  const call = useCallback(async (url: string, body: object) => {
    setBusy(true); setErr(null);
    try { onUpdate(await postJson<RunView>(url, { runId: run.runId, token, ...body })); }
    catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }, [run.runId, token, onUpdate]);

  // hết giờ → gửi "không trả lời" (không tự chuyển câu: vẫn chờ học sinh bấm "Câu tiếp")
  const timedOut = useRef<number | null>(null);
  useEffect(() => {
    if (q?.deadline && msLeft === 0 && timedOut.current !== q.index && !busy) {
      timedOut.current = q.index;
      void call("/api/daily/answer", { index: q.index, choice: null });
    }
  }, [q, msLeft, busy, call]);

  // câu đầu tiên khi tiếp tục lượt cũ mà chưa mở → hiện nút mở
  const needOpen = !!q && q.deadline === null && !showingFeedback;

  // Sau khi chấm: tự cuộn tới khung kết quả + giải thích (giống Đấu Trường).
  // Khung vừa màn hình → đáy khung ngay trên nút "Câu tiếp theo"; dài hơn → đầu khung ngay dưới thanh trên cùng.
  const reduce = useReducedMotion();
  const step = run.current; // số câu đã chấm — đổi mỗi lần có kết quả mới
  useEffect(() => {
    if (!showingFeedback) return;
    let tries = 0;
    const id = window.setInterval(() => {
      const card = document.querySelector<HTMLElement>("[data-daily-feedback]");
      const btn = document.querySelector<HTMLElement>("[data-daily-next]");
      if ((!card || !btn) && ++tries < 12) return; // chờ hiệu ứng chuyển khung xong
      window.clearInterval(id);
      if (!card) return;
      const bar = document.querySelector<HTMLElement>("[data-topbar]");
      const topLimit = (bar ? bar.getBoundingClientRect().bottom : 0) + 8;
      const bottomLimit = (btn ? btn.getBoundingClientRect().top : innerHeight) - 16;
      const r = card.getBoundingClientRect();
      if (r.top >= topLimit && r.bottom <= bottomLimit) return;
      const delta = r.height <= bottomLimit - topLimit ? r.bottom - bottomLimit : r.top - topLimit;
      window.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
    }, 80);
    return () => window.clearInterval(id);
  }, [showingFeedback, step, reduce]);

  // Mở câu mới: đưa câu hỏi về đầu màn hình
  const questionShown = !!q?.deadline;
  useEffect(() => {
    if (questionShown) window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [questionShown, q?.index, reduce]);

  return (
    <div className="mt-2 space-y-3">
      <div className="glass !rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5" aria-label={`Câu ${Math.min(run.current + 1, run.total)} trên ${run.total}`}>
          {Array.from({ length: run.total }, (_, i) => {
            const r = run.review[i];
            return <span key={i} className={cx("h-2.5 w-8 sm:w-10 rounded-full", r ? (r.correct ? "bg-emerald-500" : "bg-red-400") : i === run.current ? "bg-sky-brand" : "bg-sky-100")} />;
          })}
        </div>
        <span className="ml-auto font-black text-deep tabular-nums">{run.score} điểm</span>
        <SoundToggle className="!size-10" />
        {run.streak >= 2 && <span className="pill !bg-amber-50 !text-amber-800">🔥 {run.streak}</span>}
      </div>

      <AnimatePresence mode="wait">
        {showingFeedback && last ? (
          <motion.div key={`fb-${run.current}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div data-daily-feedback><Feedback r={last} /></div>
            <StickyActions>
              <Button size="lg" block iconRight={ArrowRight} disabled={busy} data-daily-next onClick={() => { sfx.next(); void call("/api/daily/next", {}); }}>Câu tiếp theo</Button>
            </StickyActions>
          </motion.div>
        ) : q ? (
          <motion.div key={`q-${q.index}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="glass p-5 sm:p-6">
            <div className="flex items-center justify-between text-sm font-bold text-ink-3">
              <span>Câu {q.index + 1}/{run.total} · {q.subject} · {q.level === "basic" ? "Cơ bản" : "Nâng cao"}</span>
              {q.deadline && <span className={cx("inline-flex items-center gap-1 tabular-nums", msLeft <= 5000 && "text-bad")}><Clock className="size-4" aria-hidden /> {Math.ceil(msLeft / 1000)}s</span>}
            </div>
            {q.deadline && (
              <div className="mt-2 h-2 rounded-full bg-sky-100 overflow-hidden">
                <div className="h-full rounded-full transition-[width] duration-200 ease-linear" style={{ width: `${(msLeft / (q.seconds * 1000)) * 100}%`, background: msLeft <= 5000 ? "#dc2626" : "linear-gradient(90deg,#d97706,#059669)" }} />
              </div>
            )}
            {needOpen ? (
              <div className="py-8 text-center">
                <p className="font-bold text-ink-2">Sẵn sàng cho câu {q.index + 1}? Đồng hồ chạy khi bạn bấm.</p>
                <Button className="mt-4" size="lg" icon={Play} disabled={busy} onClick={() => void call("/api/daily/next", {})}>Mở câu hỏi</Button>
              </div>
            ) : (<>
              <MathText text={q.content} className="mt-3 block font-bold text-ink text-[clamp(1.05rem,1rem+.45vw,1.4rem)] leading-snug" />
              <div className="mt-4 grid sm:grid-cols-2 gap-2.5">
                {q.options.map((o, i) => (
                  <button key={i} disabled={busy || msLeft === 0} onClick={() => { sfx.tap(); void call("/api/daily/answer", { index: q.index, choice: i }); }}
                    className="flex items-start gap-3 text-left min-h-14 px-4 py-3 rounded-2xl border-2 bg-white/85 border-sky-100 font-semibold text-ink hover:bg-white hover:border-sky-300 transition cursor-pointer disabled:opacity-60">
                    <span className="grid place-items-center size-8 rounded-lg bg-amber-50 text-amber-800 font-black shrink-0">{LETTERS[i]}</span>
                    <MathText text={o} className="pt-1" />
                  </button>
                ))}
              </div>
            </>)}
          </motion.div>
        ) : null}
      </AnimatePresence>
      {err && <p role="alert" className="font-bold text-bad">{err}</p>}
    </div>
  );
}

function Feedback({ r }: { r: RunView["review"][number] }) {
  const tone = r.correct ? "ok" : r.choice === null ? "none" : "bad";
  return (
    <div className="glass p-5 sm:p-6">
      <div className={cx("rounded-2xl p-4 flex items-center gap-3 text-white",
        tone === "ok" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : tone === "bad" ? "bg-gradient-to-br from-rose-500 to-red-700" : "bg-gradient-to-br from-slate-500 to-slate-700")}>
        <span className="grid place-items-center size-11 rounded-full bg-white/20 shrink-0">{tone === "ok" ? <Check className="size-6" strokeWidth={3} aria-hidden /> : tone === "bad" ? <X className="size-6" strokeWidth={3} aria-hidden /> : <Clock className="size-6" aria-hidden />}</span>
        <p className="font-black text-xl flex-1">{tone === "ok" ? "Chính xác!" : tone === "bad" ? "Chưa đúng" : "Hết giờ"}</p>
        <p className="font-black text-xl tabular-nums">+{r.points}</p>
      </div>
      <MathText text={r.content} className="mt-4 block font-bold text-ink" />
      <ul className="mt-2 space-y-1">
        {r.options.map((o, i) => (
          <li key={i} className={cx("flex gap-1.5", i === r.answerIndex ? "text-ok font-bold" : i === r.choice ? "text-bad font-semibold" : "text-ink-2")}>
            <span className="w-4 shrink-0">{LETTERS[i]}.</span><MathText text={o} />
            {i === r.answerIndex && <Check className="size-4 shrink-0 mt-1" aria-label="Đáp án đúng" />}
            {i === r.choice && i !== r.answerIndex && <span className="text-xs font-bold mt-0.5">(bạn chọn)</span>}
          </li>
        ))}
      </ul>
      {r.explanation && <p className="mt-3 rounded-xl bg-sky-50 border border-sky-100 p-3 text-sm text-ink-2"><b>{r.explanationReviewed ? "Giải thích: " : "Gợi ý (bản nháp): "}</b><MathText text={r.explanation} /></p>}
    </div>
  );
}

/* ---------- kết quả ---------- */
function Finished({ run, info, onBack }: { run: RunView; info: MeInfo; onBack: () => void }) {
  const great = run.correct >= 4;
  useEffect(() => { if (great) sfx.fanfare(); else sfx.finish(); progressChanged(); }, [great, run.runId]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [run.runId]);
  return (
    <div className="mt-2 space-y-4">
      <Confetti run={great} />
      <div className="glass p-6 sm:p-8 text-center">
        <p className="font-bold text-ink-2">Thử thách ngày {new Date(run.date + "T00:00:00").toLocaleDateString("vi-VN")} · Khối {run.grade}</p>
        <p className="mt-2 font-black text-[clamp(3.2rem,2.8rem+3vw,5.5rem)] leading-none title-gradient tabular-nums">{run.score}</p>
        <p className="font-bold text-ink">điểm · đúng {run.correct}/{run.total} câu</p>
        <p className="mt-2 text-sm text-ink-3">{run.ranked ? "Kết quả đã được ghi lên bảng xếp hạng hôm nay." : "Chế độ khách — đăng nhập để lên bảng xếp hạng."}</p>
        <p className="mt-1 text-sm text-ink-3">Thử thách mới sau <Countdown to={info.resetAt} offset={0} />.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <ShareButton req={run.token ? { kind: "daily", runId: run.runId, token: run.token, name: store.get<{ name: string }>("local", "live-last-name")?.name ?? null } : null} />
          <Button variant="soft" icon={RotateCcw} onClick={onBack}>Về trang thử thách</Button>
        </div>
      </div>
      <section className="space-y-3">
        <h2 className="font-black text-ink text-lg">Xem lại 5 câu</h2>
        {run.review.map((r, i) => <Feedback key={i} r={r} />)}
      </section>
    </div>
  );
}
