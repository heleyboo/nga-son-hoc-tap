"use client";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, House, Clock, Hourglass, Loader2, LogOut, Medal, Radio, Sparkles, Trophy, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SoundToggle } from "@/features/arena/components/SoundToggle";
import { sfx, vibrate } from "@/lib/sfx";
import { Button, Confetti, cx } from "@/features/arena/components/ui";
import { MathText, plainMath } from "@/features/arena/components/MathText";
import { useIsClient } from "@/features/arena/lib/client";
import type { PlayerView } from "@/lib/live/types";
import { AnswerGlyph, answerStyle, postJson, setUrlParam, store, useCountdown, useLiveStream, useUrlParam } from "./shared";

interface Seat { playerId: string; token: string; name: string }
const seatKey = (code: string) => `live-seat:${code}`;

/** Trang học sinh: nhập mã → nhập tên → chơi theo nhịp màn hình chiếu */
export function PlayerApp() {
  const isClient = useIsClient();
  const code = useUrlParam("ma");
  // ghế ngồi lưu theo tab (sessionStorage) để tải lại trang vẫn giữ điểm; mỗi tab là 1 người chơi
  const [seatVer, setSeatVer] = useState(0);
  const seat = isClient && code ? store.get<Seat>("session", seatKey(code)) : null;
  void seatVer;

  if (!isClient) return <Frame><div className="h-40" /></Frame>;
  if (!code || !/^\d{6}$/.test(code)) return <Frame><EnterCode /></Frame>;
  if (!seat) return <Frame><EnterName code={code} onJoined={() => setSeatVer((v) => v + 1)} /></Frame>;
  return <Play code={code} seat={seat} onLeave={() => { store.del("session", seatKey(code)); setSeatVer((v) => v + 1); setUrlParam("ma", null); }} />;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh grid place-items-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 text-deep font-black tracking-tight">
          <span className="grid place-items-center size-10 rounded-[14px] btn-primary"><Radio className="size-5" aria-hidden /></span>
          LỚP HỌC TRỰC TIẾP
        </Link>
        {children}
        <Link href="/" className="mt-5 flex items-center justify-center gap-1.5 min-h-11 text-sm font-bold text-ink-3 hover:text-deep">
          <House className="size-4" aria-hidden /> Về trang chủ
        </Link>
      </div>
    </main>
  );
}

function EnterCode() {
  const [v, setV] = useState("");
  const valid = /^\d{6}$/.test(v);
  return (
    <form className="glass p-6 sm:p-7" onSubmit={(e) => { e.preventDefault(); if (valid) setUrlParam("ma", v); }}>
      <h1 className="font-black text-2xl text-ink text-center">Vào phòng học</h1>
      <p className="text-ink-2 text-center mt-1">Nhập mã 6 số trên màn hình của thầy cô</p>
      <label htmlFor="code" className="sr-only">Mã phòng</label>
      <input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus value={v}
        onChange={(e) => setV(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        className="mt-5 w-full text-center font-black tracking-[.35em] text-4xl py-4 rounded-2xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none text-deep placeholder:text-slate-300" />
      <Button type="submit" size="lg" block className="mt-4" disabled={!valid} iconRight={ArrowRight}>Tiếp tục</Button>
    </form>
  );
}

function EnterName({ code, onJoined }: { code: string; onJoined: () => void }) {
  const last = store.get<{ name: string; className: string }>("local", "live-last-name");
  const [name, setName] = useState(last?.name ?? "");
  const [cls, setCls] = useState(last?.className ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const submit = async () => {
    setBusy(true); setErr(null);
    try {
      const r = await postJson<Seat>(`/api/live/${code}/join`, { name, className: cls || null });
      store.set("session", seatKey(code), r);
      store.set("local", "live-last-name", { name, className: cls });
      onJoined();
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };
  return (
    <form className="glass p-6 sm:p-7" onSubmit={(e) => { e.preventDefault(); if (name.trim()) void submit(); }}>
      <p className="text-center text-ink-2 font-semibold">Phòng <span className="font-black text-deep tracking-widest">{code}</span></p>
      <h1 className="font-black text-2xl text-ink text-center mt-1">Bạn tên là gì?</h1>
      <label className="block mt-5">
        <span className="text-sm font-bold text-ink-2">Tên hiển thị</span>
        <input autoFocus maxLength={24} value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Minh Anh"
          className="mt-1 w-full px-4 min-h-13 text-lg font-bold rounded-2xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none" />
      </label>
      <label className="block mt-3">
        <span className="text-sm font-bold text-ink-2">Lớp (không bắt buộc)</span>
        <input maxLength={20} value={cls} onChange={(e) => setCls(e.target.value)} placeholder="VD: 7A"
          className="mt-1 w-full px-4 min-h-12 font-semibold rounded-2xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none" />
      </label>
      {err && <p role="alert" className="mt-3 text-sm font-bold text-bad">{err}</p>}
      <Button type="submit" size="lg" block className="mt-5" disabled={!name.trim() || busy} icon={busy ? Loader2 : undefined} iconRight={busy ? undefined : ArrowRight}>
        {busy ? "Đang vào phòng…" : "Vào phòng"}
      </Button>
      <button type="button" onClick={() => setUrlParam("ma", null)} className="mt-3 w-full text-sm font-semibold text-ink-3 hover:text-deep cursor-pointer">Nhập mã khác</button>
    </form>
  );
}

function Play({ code, seat, onLeave }: { code: string; seat: Seat; onLeave: () => void }) {
  const { view: v, status, offset } = useLiveStream<PlayerView>(`/api/live/${code}/stream?pid=${encodeURIComponent(seat.playerId)}&token=${encodeURIComponent(seat.token)}`);
  usePlayerSounds(v);
  const [picked, setPicked] = useState<{ q: number; choice: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (status === "failed" && !v) {
    return (
      <Frame>
        <div className="glass p-6 text-center">
          <WifiOff className="size-10 mx-auto text-ink-3" aria-hidden />
          <p className="mt-3 font-black text-xl text-ink">Không vào được phòng</p>
          <p className="text-ink-2 mt-1">Phòng có thể đã đóng hoặc máy chủ vừa khởi động lại.</p>
          <Button className="mt-5" onClick={onLeave}>Nhập lại mã phòng</Button>
        </div>
      </Frame>
    );
  }
  if (!v) return <Frame><div className="glass p-8 text-center"><Loader2 className="size-8 mx-auto animate-spin text-sky-brand" aria-hidden /><p className="mt-3 font-bold text-ink-2">Đang kết nối…</p></div></Frame>;

  if (v.phase === "kicked" || v.phase === "closed") {
    return (
      <Frame>
        <div className="glass p-6 text-center">
          <p className="font-black text-xl text-ink">{v.phase === "kicked" ? "Bạn đã được mời ra khỏi phòng" : "Phòng đã đóng"}</p>
          <Button className="mt-5" onClick={onLeave}>Về màn hình nhập mã</Button>
        </div>
      </Frame>
    );
  }

  const myChoice = v.myChoice ?? (picked && picked.q === v.qIndex ? picked.choice : null);
  const choose = async (i: number) => {
    if (myChoice !== null) return;
    sfx.tap();
    setPicked({ q: v.qIndex, choice: i });
    setErr(null);
    try {
      await postJson(`/api/live/${code}/answer`, { playerId: seat.playerId, token: seat.token, qIndex: v.qIndex, choice: i });
    } catch (e) {
      setErr((e as Error).message);
      setPicked(null);
    }
  };

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 px-3 pt-[max(8px,env(safe-area-inset-top))] pb-2">
        <div className="glass !rounded-2xl flex items-center gap-2 px-3 py-2">
          <span className="grid place-items-center size-9 rounded-xl btn-primary font-black shrink-0">{v.me.name.charAt(0).toUpperCase()}</span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="font-extrabold text-ink truncate">{v.me.name}</p>
            <p className="text-xs font-semibold text-ink-3">Phòng {code}{v.total ? ` · Câu ${Math.max(1, v.qIndex + 1)}/${v.total}` : ""}</p>
          </div>
          <SoundToggle className="!size-10 shrink-0" />
          <div className="text-right leading-tight">
            <p className="font-black text-deep tabular-nums">{v.me.score.toLocaleString("vi-VN")}</p>
            <p className="text-xs font-bold text-ink-3">Hạng {v.me.rank || "–"}/{v.me.of}</p>
          </div>
        </div>
        {status === "reconnecting" && (
          <p role="status" className="mt-2 text-center text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl py-1.5">
            Mất kết nối, đang thử lại…
          </p>
        )}
      </header>

      <div className="flex-1 flex flex-col px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          <motion.div key={`${v.phase}-${v.qIndex}`} className="flex-1 flex flex-col"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            {v.phase === "lobby" && <Lobby v={v} onLeave={onLeave} />}
            {v.phase === "question" && <Question v={v} offset={offset} myChoice={myChoice} onChoose={choose} err={err} />}
            {(v.phase === "reveal" || v.phase === "leaderboard") && <Result v={v} />}
            {v.phase === "ended" && <Final v={v} onLeave={onLeave} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function Lobby({ v, onLeave }: { v: PlayerView; onLeave: () => void }) {
  return (
    <div className="flex-1 grid place-items-center text-center">
      <div>
        <motion.div className="mx-auto size-24 rounded-full grid place-items-center bg-white shadow-[var(--shadow-card)]"
          animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <Check className="size-12 text-ok" strokeWidth={3} aria-hidden />
        </motion.div>
        <p className="mt-5 font-black text-2xl text-ink">Bạn đã vào phòng!</p>
        <p className="mt-1 text-ink-2 font-semibold">Hãy nhìn lên màn hình và chờ thầy cô bắt đầu.</p>
        <p className="mt-4 pill !bg-white">{v.me.of} bạn đang trong phòng</p>
        <div><button onClick={onLeave} className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-bad cursor-pointer"><LogOut className="size-4" aria-hidden /> Rời phòng</button></div>
      </div>
    </div>
  );
}

function Question({ v, offset, myChoice, onChoose, err }: { v: PlayerView; offset: number; myChoice: number | null; onChoose: (i: number) => void; err: string | null }) {
  const { left, ms } = useCountdown(v.deadline, offset);
  const total = v.seconds * 1000;
  const q = v.question!;
  const locked = myChoice !== null || (v.deadline !== null && ms <= 0);
  const ticked = useRef("");
  useEffect(() => {
    if (myChoice !== null || left < 1 || left > 5) return;
    const k = `${v.qIndex}:${left}`;
    if (ticked.current === k) return;
    ticked.current = k;
    sfx.tick(left);
  }, [myChoice, left, v.qIndex]);
  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="glass !rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2 text-sm font-bold text-ink-3">
          <span>Câu {v.qIndex + 1}/{v.total} · {q.subject}</span>
          <span className={cx("inline-flex items-center gap-1 tabular-nums", left <= 5 && "text-bad")}><Clock className="size-4" aria-hidden />{left}s</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-sky-100 overflow-hidden">
          <div className="h-full rounded-full transition-[width] duration-200 ease-linear" style={{ width: `${Math.min(100, (ms / total) * 100)}%`, background: left <= 5 ? "#dc2626" : "linear-gradient(90deg,#0284c7,#10b981)" }} />
        </div>
        <MathText text={q.content} className="mt-3 block font-bold text-ink text-[1.05rem] leading-snug" />
      </div>

      {myChoice !== null ? (
        <div className="flex-1 grid place-items-center text-center">
          <div>
            <span className="mx-auto grid place-items-center size-20 rounded-3xl text-white" style={{ background: answerStyle(myChoice).color }}>
              <AnswerGlyph i={myChoice} className="size-10" />
            </span>
            <p className="mt-4 font-black text-xl text-ink">Đã chọn {answerStyle(myChoice).letter}</p>
            <p className="mt-1 text-ink-2 font-semibold inline-flex items-center gap-1.5"><Hourglass className="size-4" aria-hidden /> Chờ thầy cô công bố đáp án…</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 gap-2.5 content-start" role="group" aria-label="Chọn đáp án">
          {q.options.map((o, i) => {
            const s = answerStyle(i);
            return (
              <motion.button key={i} whileTap={{ scale: 0.97 }} disabled={locked} onClick={() => onChoose(i)}
                className="flex items-center gap-3 min-h-16 px-4 py-3 rounded-2xl text-white text-left font-bold shadow-[0_10px_22px_-14px_rgba(15,23,42,.6)] disabled:opacity-50 cursor-pointer"
                style={{ background: s.color }} aria-label={`Đáp án ${s.letter} (${s.shape}): ${plainMath(o)}`}>
                <span className="grid place-items-center size-10 rounded-xl bg-white/20 shrink-0"><AnswerGlyph i={i} /></span>
                <span className="font-black text-lg w-5 shrink-0">{s.letter}</span>
                <MathText text={o} className="leading-snug" />
              </motion.button>
            );
          })}
          {err && <p role="alert" className="text-center text-sm font-bold text-bad">{err}</p>}
          {locked && myChoice === null && <p className="text-center font-bold text-ink-2">Hết giờ!</p>}
        </div>
      )}
    </div>
  );
}

function Result({ v }: { v: PlayerView }) {
  const r = v.result;
  if (!r) return null;
  const tone = !r.answered ? "none" : r.correct ? "ok" : "bad";
  const correctStyle = answerStyle(r.answerIndex);
  return (
    <div className="flex-1 flex flex-col gap-3 justify-center">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className={cx("rounded-[28px] p-6 text-center text-white shadow-[var(--shadow-lift)]",
          tone === "ok" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : tone === "bad" ? "bg-gradient-to-br from-rose-500 to-red-700" : "bg-gradient-to-br from-slate-500 to-slate-700")}>
        <span className="mx-auto grid place-items-center size-16 rounded-full bg-white/20">
          {tone === "ok" ? <Check className="size-9" strokeWidth={3} aria-hidden /> : tone === "bad" ? <X className="size-9" strokeWidth={3} aria-hidden /> : <Clock className="size-8" aria-hidden />}
        </span>
        <p className="mt-3 font-black text-3xl">{tone === "ok" ? "Chính xác!" : tone === "bad" ? "Chưa đúng" : "Hết giờ"}</p>
        <p className="mt-1 font-bold text-white/90">{tone === "ok" ? `+${r.points} điểm` : "+0 điểm"}{tone === "ok" && v.me.streak >= 2 ? ` · chuỗi ${v.me.streak} 🔥` : ""}</p>
      </motion.div>
      {tone !== "ok" && (
        <div className="glass !rounded-2xl p-4">
          <p className="text-sm font-bold text-ink-3">Đáp án đúng</p>
          <p className="mt-1 flex items-center gap-2 font-extrabold text-ink">
            <span className="grid place-items-center size-8 rounded-lg text-white shrink-0" style={{ background: correctStyle.color }}><AnswerGlyph i={r.answerIndex} className="size-4" /></span>
            {correctStyle.letter}. <MathText text={v.question?.options[r.answerIndex] ?? ""} />
          </p>
        </div>
      )}
      {r.explanation && (
        <div className="glass !rounded-2xl p-4 text-sm text-ink-2">
          <p className="font-bold text-ink-3 mb-1">{r.explanationReviewed ? "Giải thích" : "Gợi ý giải thích (bản nháp, chờ thầy cô duyệt)"}</p>
          <MathText text={r.explanation} />
        </div>
      )}
      <div className="glass !rounded-2xl p-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-bold text-ink-2"><Medal className="size-5 text-gold" aria-hidden /> Hạng của bạn</span>
        <span className="font-black text-2xl text-deep tabular-nums">{v.me.rank}<span className="text-base text-ink-3">/{v.me.of}</span></span>
      </div>
    </div>
  );
}

function Final({ v, onLeave }: { v: PlayerView; onLeave: () => void }) {
  const top3 = v.me.rank > 0 && v.me.rank <= 3;
  return (
    <div className="flex-1 flex flex-col justify-center gap-3 text-center">
      <Confetti run={top3} />
      <div className="glass p-6">
        {top3 ? <Trophy className="size-14 mx-auto text-gold" aria-hidden /> : <Sparkles className="size-12 mx-auto text-sky-brand" aria-hidden />}
        <p className="mt-2 font-bold text-ink-2">Kết thúc! Bạn xếp hạng</p>
        <p className="font-black text-6xl title-gradient leading-tight">{v.me.rank}<span className="text-2xl text-ink-3">/{v.me.of}</span></p>
        <p className="mt-1 font-bold text-ink">{v.me.score.toLocaleString("vi-VN")} điểm · đúng {v.me.correct}/{v.total} câu</p>
      </div>
      {v.podium.length > 0 && (
        <div className="glass !rounded-2xl p-4 text-left">
          <p className="font-bold text-ink-3 text-sm mb-2">Bục vinh danh</p>
          <ol className="space-y-1.5">
            {v.podium.map((p, i) => (
              <li key={i} className="flex items-center gap-3 font-bold text-ink">
                <span className="grid place-items-center size-8 rounded-full text-white font-black" style={{ background: ["#d97706", "#64748b", "#b45309"][p.rank - 1] ?? "#0284c7" }}>{p.rank}</span>
                <span className="flex-1 truncate">{p.name}</span>
                <span className="tabular-nums text-deep">{p.score.toLocaleString("vi-VN")}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <Button variant="soft" onClick={onLeave}>Vào phòng khác</Button>
      <Link href="/" className="text-sm font-semibold text-ink-3 hover:text-deep">Về trang chủ</Link>
    </div>
  );
}

/** Âm thanh trên điện thoại học sinh: câu mới, kết quả từng câu (đúng/sai/hết giờ), kết thúc */
function usePlayerSounds(v: PlayerView | null) {
  const key = v ? `${v.phase}:${v.qIndex}` : "";
  const prev = useRef("");
  useEffect(() => {
    if (!v || !key || key === prev.current) return;
    const first = prev.current === "";
    prev.current = key;
    if (first) return;
    if (v.phase === "question") sfx.start();
    else if (v.phase === "reveal" && v.result) {
      if (v.result.correct) { sfx.correct(); if (v.me.streak >= 3) sfx.combo(v.me.streak); }
      else if (!v.result.answered) sfx.timeout();
      else { sfx.wrong(); vibrate([60, 40, 60]); }
    } else if (v.phase === "ended") {
      if (v.me.rank > 0 && v.me.rank <= 3) sfx.fanfare(); else sfx.finish();
    }
  }, [key, v]);
}
