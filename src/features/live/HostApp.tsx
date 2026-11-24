"use client";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  ArrowDown, ArrowRight, ArrowUp, House, BarChart3, Check, ChevronRight, Copy, Download, Flag, Loader2, Maximize2, Minimize2,
  Play, Plus, Radio, Smartphone, Trophy as TrophyIcon, Users, WifiOff, X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SoundToggle } from "@/features/arena/components/SoundToggle";
import { sfx } from "@/lib/sfx";
import { Button, Confetti, cx, StickyActions, SubjectBadge, Trophy } from "@/features/arena/components/ui";
import { MathText } from "@/features/arena/components/MathText";
import { useToast } from "@/features/arena/components/Toast";
import { GRADES, LEVELS, SUBJECT_ORDER } from "@/features/arena/data/meta";
import type { Catalog, Grade, Level, Subject } from "@/features/arena/data/types";
import { fetchCatalog } from "@/features/arena/lib/api";
import { useIsClient } from "@/features/arena/lib/client";
import type { HostView, LiveRankRow } from "@/lib/live/types";
import { AnswerGlyph, answerStyle, postJson, setUrlParam, store, useCountdown, useLiveStream, useUrlParam } from "./shared";

const hostKeyOf = (code: string) => store.get<string>("local", `live-host:${code}`);

/** Trang giáo viên: tạo phòng → màn hình trình chiếu điều khiển cả lớp */
export function HostApp() {
  const isClient = useIsClient();
  const code = useUrlParam("ma");
  if (!isClient) return <div className="min-h-dvh" />;
  if (!code) return <CreateRoom />;
  const key = hostKeyOf(code);
  if (!key) {
    return (
      <main className="min-h-dvh grid place-items-center p-4">
        <div className="glass p-7 max-w-md text-center">
          <p className="font-black text-xl text-ink">Không thể điều khiển phòng {code}</p>
          <p className="mt-2 text-ink-2">Chỉ trình duyệt đã tạo phòng mới điều khiển được. Học sinh vào phòng tại trang <b>/tham-gia</b>.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button onClick={() => setUrlParam("ma", null)} icon={Plus}>Tạo phòng mới</Button>
            <Link href={`/tham-gia?ma=${code}`} className="inline-flex items-center min-h-12 px-5 rounded-[var(--radius-ctl)] font-extrabold bg-white text-deep border border-sky-100">Vào với tư cách học sinh</Link>
          </div>
        </div>
      </main>
    );
  }
  return <HostScreen code={code} hostKey={key} />;
}

/* =================== Tạo phòng =================== */
function CreateRoom() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [grade, setGrade] = useState<Grade>(7);
  const [level, setLevel] = useState<Level>("basic");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [count, setCount] = useState(10);
  const [seconds, setSeconds] = useState(20);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { fetchCatalog().then(setCatalog).catch((e: Error) => setErr(e.message)); }, []);

  const avail = catalog?.[grade]?.[level] ?? {};
  const pool = (subjects.length ? subjects : (Object.keys(avail) as Subject[])).reduce((n, s) => n + (avail[s] ?? 0), 0);
  const toggle = (s: Subject) => setSubjects((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const create = async () => {
    setBusy(true); setErr(null);
    try {
      const r = await postJson<{ code: string; hostKey: string }>("/api/live", { grade, level, subjects, count, seconds });
      store.set("local", `live-host:${r.code}`, r.hostKey);
      setUrlParam("ma", r.code);
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  const seg = (on: boolean) => cx("min-h-12 px-4 rounded-2xl font-extrabold border-2 transition cursor-pointer",
    on ? "bg-white border-sky-brand text-deep shadow-[0_10px_24px_-14px_rgba(2,132,199,.6)]" : "bg-white/70 border-transparent text-ink-2 hover:bg-white");

  return (
    <main className="container-arena py-8 sm:py-12">
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link href="/" className="flex items-center gap-2.5 text-deep font-black tracking-tight">
          <span className="grid place-items-center size-11 rounded-[14px] btn-primary"><Radio className="size-5" aria-hidden /></span>
          <span className="leading-tight">LỚP HỌC TRỰC TIẾP<span className="block text-xs font-semibold text-ink-3">Web Học Tập THCS Nga Sơn</span></span>
        </Link>
        <div className="flex items-center gap-1.5 shrink-0">
          <Link href="/" aria-label="Về trang chủ" title="Về trang chủ"
            className="inline-grid place-items-center size-11 rounded-2xl bg-white/80 border border-white text-deep hover:bg-white">
            <House className="size-5" aria-hidden />
          </Link>
          <Link href="/tham-gia" className="inline-flex items-center gap-2 min-h-11 px-3 sm:px-4 rounded-2xl bg-white/80 border border-white font-bold text-deep hover:bg-white">
            <Smartphone className="size-4.5" aria-hidden /> <span className="max-sm:hidden">Tôi là học sinh</span><span className="sm:hidden">Học sinh</span>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6 items-start">
        <section className="glass p-5 sm:p-7">
          <h1 className="font-black text-[length:var(--fs-h1)] leading-tight title-gradient">Mở phòng thi cho cả lớp</h1>
          <p className="mt-2 text-ink-2">Câu hỏi hiện trên màn hình chiếu, học sinh trả lời bằng điện thoại. Bảng xếp hạng cập nhật sau mỗi câu.</p>

          <fieldset className="mt-6">
            <legend className="font-extrabold text-ink mb-2">Khối lớp</legend>
            <div className="grid grid-cols-4 gap-2">
              {([6, 7, 8, 9] as Grade[]).map((gr) => (
                <button key={gr} type="button" aria-pressed={grade === gr} onClick={() => { setGrade(gr); setSubjects([]); }} className={seg(grade === gr)}
                  style={grade === gr ? { borderColor: GRADES[gr].from, color: GRADES[gr].ink } : undefined}>Khối {gr}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="font-extrabold text-ink mb-2">Cấp độ</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["basic", "advanced"] as Level[]).map((l) => (
                <button key={l} type="button" aria-pressed={level === l} onClick={() => { setLevel(l); setSubjects([]); }} className={seg(level === l)}>
                  {LEVELS[l].emoji} {LEVELS[l].label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="font-extrabold text-ink mb-2">Môn học <span className="font-semibold text-ink-3 text-sm">(bỏ trống = trộn tất cả)</span></legend>
            {!catalog ? <p className="text-ink-3 inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin" aria-hidden /> Đang tải kho câu hỏi…</p> : (
              <div className="flex flex-wrap gap-2">
                {SUBJECT_ORDER.filter((s) => avail[s]).map((s) => (
                  <button key={s} type="button" aria-pressed={subjects.includes(s)} onClick={() => toggle(s)}
                    className={cx("rounded-full p-0.5 border-2 cursor-pointer transition", subjects.includes(s) ? "border-sky-brand" : "border-transparent opacity-80 hover:opacity-100")}>
                    <SubjectBadge subject={s} /> <span className="sr-only">{avail[s]} câu</span>
                  </button>
                ))}
              </div>
            )}
          </fieldset>

          <div className="mt-5 grid sm:grid-cols-2 gap-5">
            <fieldset>
              <legend className="font-extrabold text-ink mb-2">Số câu</legend>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((n) => <button key={n} type="button" aria-pressed={count === n} onClick={() => setCount(n)} className={seg(count === n)}>{n}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-extrabold text-ink mb-2">Thời gian mỗi câu</legend>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 45].map((n) => <button key={n} type="button" aria-pressed={seconds === n} onClick={() => setSeconds(n)} className={seg(seconds === n)}>{n}s</button>)}
              </div>
            </fieldset>
          </div>

          {catalog && <p className="mt-4 text-sm font-semibold text-ink-3">Kho có {pool} câu phù hợp{pool < count ? ` — phòng sẽ dùng ${pool} câu` : ""}.</p>}
          {err && <p role="alert" className="mt-3 font-bold text-bad">{err}</p>}
        </section>

        <aside className="glass-soft p-5 sm:p-7 rounded-[var(--radius-card)]">
          <h2 className="font-black text-ink text-xl">Cách tổ chức</h2>
          <ol className="mt-4 space-y-4">
            {[
              ["Mở phòng & chiếu màn hình", "Bấm F để toàn màn hình. Dùng được máy chiếu, TV hoặc màn hình laptop."],
              ["Học sinh quét mã QR", "Hoặc vào trang /tham-gia và nhập mã 6 số. Không cần đăng nhập."],
              ["Bắt đầu & điều khiển", "Phím Space / Enter chuyển bước: câu hỏi → đáp án → bảng xếp hạng → câu tiếp."],
              ["Tổng kết", "Bục vinh danh top 3 và tải bảng điểm (CSV mở bằng Excel)."],
            ].map(([t, d], i) => (
              <li key={i} className="flex gap-3">
                <span className="grid place-items-center size-9 rounded-xl btn-primary font-black shrink-0">{i + 1}</span>
                <div><p className="font-extrabold text-ink">{t}</p><p className="text-ink-2 text-sm">{d}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-ink-3">Điểm mỗi câu: 100 khi đúng + thưởng tốc độ (tối đa 50) + thưởng chuỗi đúng liên tiếp (tối đa 80).</p>
        </aside>
      </div>
      <StickyActions inner="lg:w-[calc((100%-1.5rem)*1.1/2)]">
        <Button size="lg" block onClick={() => void create()} disabled={busy || !catalog || pool === 0}
          icon={busy ? Loader2 : Radio}>{busy ? "Đang mở phòng…" : `Mở phòng · ${Math.min(count, pool || count)} câu · ${seconds}s/câu`}</Button>
      </StickyActions>
    </main>
  );
}

/* =================== Màn hình trình chiếu =================== */
async function toggleFs() {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { /* bỏ qua */ }
}
const subscribeFs = (cb: () => void) => { document.addEventListener("fullscreenchange", cb); return () => document.removeEventListener("fullscreenchange", cb); };

function useJoinUrl(code: string) {
  const [publicUrl, setPublicUrl] = useState<string | null | undefined>(undefined);
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  useEffect(() => {
    if (!local) return;
    fetch("/api/live/origin").then((r) => r.json()).then((d: { url: string | null }) => setPublicUrl(d.url)).catch(() => setPublicUrl(null));
  }, [local]);
  const origin = local ? publicUrl ?? location.origin : location.origin;
  return { url: `${origin}/tham-gia?ma=${code}`, short: `${origin.replace(/^https?:\/\//, "")}/tham-gia`, localOnly: local && publicUrl === null };
}

function HostScreen({ code, hostKey }: { code: string; hostKey: string }) {
  const { view: v, status, offset } = useLiveStream<HostView>(`/api/live/${code}/stream?key=${encodeURIComponent(hostKey)}`);
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const isFs = useSyncExternalStore(subscribeFs, () => !!document.fullscreenElement, () => false);

  // Âm thanh cho màn chiếu: học sinh vào phòng, mở câu, đếm ngược, công bố, bảng xếp hạng, vinh danh
  const playerCount = v?.players.length ?? 0;
  const prevCount = useRef(playerCount);
  useEffect(() => {
    if (playerCount > prevCount.current && v?.phase === "lobby") sfx.join();
    prevCount.current = playerCount;
  }, [playerCount, v?.phase]);
  const phaseKey = v ? `${v.phase}:${v.qIndex}` : "";
  const prevPhase = useRef("");
  useEffect(() => {
    if (!v || !phaseKey || phaseKey === prevPhase.current) return;
    const first = prevPhase.current === "";
    prevPhase.current = phaseKey;
    if (first) return; // mở lại trang giữa chừng: không phát lại
    if (v.phase === "question") sfx.start();
    else if (v.phase === "reveal") sfx.reveal();
    else if (v.phase === "leaderboard") sfx.next();
    else if (v.phase === "ended") sfx.fanfare();
  }, [phaseKey, v]);

  const act = async (action: string, playerId?: string) => {
    if (busy) return;
    setBusy(true);
    try { await postJson(`/api/live/${code}/host`, { key: hostKey, action, playerId }); }
    catch (e) { toast((e as Error).message, "info"); }
    finally { setBusy(false); }
  };

  const primary: { label: string; action: string; icon: typeof Play } | null = !v ? null
    : v.phase === "lobby" ? (v.players.length ? { label: "Bắt đầu", action: "start", icon: Play } : null)
    : v.phase === "question" ? { label: "Công bố đáp án", action: "reveal", icon: Check }
    : v.phase === "reveal" ? { label: "Bảng xếp hạng", action: "leaderboard", icon: BarChart3 }
    : v.phase === "leaderboard" ? (v.qIndex + 1 >= v.total ? { label: "Xem kết quả", action: "next", icon: Flag } : { label: "Câu tiếp theo", action: "next", icon: ArrowRight })
    : null;

  // Phím tắt cho người trình chiếu: Space/Enter/→ = bước tiếp, F = toàn màn hình
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, button, a")) return;
      if ((e.key === " " || e.key === "Enter" || e.key === "ArrowRight") && primary) { e.preventDefault(); void act(primary.action); }
      if (e.key.toLowerCase() === "f") void toggleFs();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!v) {
    return (
      <main className="min-h-dvh grid place-items-center p-4">
        <div className="glass p-7 text-center max-w-md">
          {status === "failed" ? (<>
            <WifiOff className="size-10 mx-auto text-ink-3" aria-hidden />
            <p className="mt-3 font-black text-xl text-ink">Phòng {code} không còn tồn tại</p>
            <p className="mt-1 text-ink-2">Máy chủ có thể vừa khởi động lại. Hãy mở phòng mới.</p>
            <Button className="mt-5" icon={Plus} onClick={() => setUrlParam("ma", null)}>Tạo phòng mới</Button>
          </>) : (<><Loader2 className="size-8 mx-auto animate-spin text-sky-brand" aria-hidden /><p className="mt-3 font-bold text-ink-2">Đang mở phòng…</p></>)}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col">
      {/* thanh trên */}
      <header className="px-3 sm:px-5 pt-3">
        <div className="glass !rounded-[22px] flex items-center gap-2 sm:gap-3 px-3 py-2">
          <span className="grid place-items-center size-10 rounded-[14px] btn-primary shrink-0"><Radio className="size-5" aria-hidden /></span>
          <div className="leading-tight min-w-0 flex-1">
            <p className="font-black text-deep truncate">LỚP HỌC TRỰC TIẾP</p>
            <p className="text-xs font-semibold text-ink-3 truncate">Khối {v.config.grade} · {LEVELS[v.config.level].label} · {v.total} câu · {v.config.seconds}s/câu</p>
          </div>
          <span className="pill !bg-white font-black tracking-widest text-deep">#{code}</span>
          <span className="pill !bg-white" title="Số học sinh"><Users className="size-4" aria-hidden /> {v.players.length}</span>
          {status === "reconnecting" && <span className="pill !bg-amber-50 !text-amber-800">Đang kết nối lại…</span>}
          <Link href="/" aria-label="Về trang chủ" title="Về trang chủ (phòng vẫn mở, quay lại được)"
            className="inline-grid place-items-center size-11 rounded-2xl bg-white/80 border border-white text-deep hover:bg-white shrink-0">
            <House className="size-5" aria-hidden />
          </Link>
          <SoundToggle className="!size-11 max-sm:hidden" />
          <button onClick={() => void toggleFs()} className="inline-grid place-items-center size-11 rounded-2xl bg-white/80 border border-white text-deep hover:bg-white cursor-pointer max-sm:hidden"
            aria-label={isFs ? "Thoát toàn màn hình" : "Toàn màn hình (F)"} title={isFs ? "Thoát toàn màn hình" : "Toàn màn hình (F)"}>
            {isFs ? <Minimize2 className="size-5" aria-hidden /> : <Maximize2 className="size-5" aria-hidden />}
          </button>
          {v.phase !== "ended" && v.phase !== "lobby" && (
            <button onClick={() => void act("end")} className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-2xl bg-white border border-red-200 text-bad font-bold hover:bg-red-50 cursor-pointer">
              <X className="size-4" aria-hidden /><span className="max-md:sr-only">Kết thúc</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col px-3 sm:px-5 py-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div key={v.phase === "lobby" || v.phase === "ended" ? v.phase : `${v.phase}-${v.qIndex}`} className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {v.phase === "lobby" && <Lobby v={v} code={code} onKick={(id) => void act("kick", id)} />}
            {(v.phase === "question" || v.phase === "reveal") && <QuestionStage v={v} offset={offset} />}
            {v.phase === "leaderboard" && <Leaderboard rows={v.ranking} qIndex={v.qIndex} total={v.total} />}
            {v.phase === "ended" && <Final v={v} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {primary && (
        <footer className="sticky bottom-0 z-30 px-3 sm:px-5 pt-4 pb-[max(12px,env(safe-area-inset-bottom))] flex items-center justify-end gap-3 bg-gradient-to-t from-[#eefaff] via-[#eefaff]/90 to-transparent">
          <span className="text-xs font-semibold text-ink-3 max-sm:hidden">Phím Space / Enter</span>
          <Button size="lg" icon={busy ? Loader2 : primary.icon} disabled={busy} onClick={() => void act(primary.action)}>{primary.label}</Button>
        </footer>
      )}
    </main>
  );
}

function Lobby({ v, code, onKick }: { v: HostView; code: string; onKick: (id: string) => void }) {
  const join = useJoinUrl(code);
  const toast = useToast();
  return (
    <div className="flex-1 grid lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] gap-5 items-start">
      <section className="glass p-5 sm:p-7 text-center">
        <p className="font-bold text-ink-2 inline-flex items-center gap-2"><Smartphone className="size-5" aria-hidden /> Quét mã hoặc vào <b className="text-deep">{join.short}</b></p>
        <div className="mt-4 mx-auto w-[min(62vw,330px,38dvh)] aspect-square rounded-3xl bg-white p-3 shadow-[var(--shadow-card)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/live/qr?url=${encodeURIComponent(join.url)}`} alt={`Mã QR vào phòng ${code}`} className="size-full" />
        </div>
        <p className="mt-5 text-ink-3 font-bold uppercase tracking-widest text-sm">Mã phòng</p>
        <p className="font-black text-deep tabular-nums leading-none text-[clamp(3rem,min(2rem+5vw,11dvh),6.5rem)] tracking-[.12em]">{code.slice(0, 3)} {code.slice(3)}</p>
        <button onClick={() => { void navigator.clipboard?.writeText(join.url).then(() => toast("Đã chép đường dẫn vào phòng", "ok")); }}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-ink-3 hover:text-deep cursor-pointer"><Copy className="size-4" aria-hidden /> Chép đường dẫn</button>
        {join.localOnly && (
          <p className="mt-3 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-left">
            Bạn đang mở bằng localhost nên điện thoại không vào được địa chỉ này. Hãy mở trang bằng địa chỉ IP của máy trong mạng Wi-Fi, hoặc đặt <code>LIVE_PUBLIC_URL</code> trong <code>.env</code>.
          </p>
        )}
      </section>

      <section className="glass p-5 sm:p-7 min-h-[300px] flex flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-black text-ink text-2xl">Học sinh đã vào</h2>
          <span className="font-black text-deep text-4xl tabular-nums">{v.players.length}</span>
        </div>
        {v.players.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center text-ink-3 font-semibold">
            <div><Loader2 className="size-8 mx-auto animate-spin mb-3 text-sky-brand" aria-hidden />Đang chờ học sinh vào phòng…</div>
          </div>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2 content-start overflow-y-auto max-h-[45vh] lg:max-h-[calc(100dvh-310px)] pr-1" aria-label="Danh sách học sinh">
            <AnimatePresence>
              {v.players.map((p) => (
                <motion.li key={p.id} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                  className={cx("group inline-flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-full bg-white border border-sky-100 font-bold text-ink shadow-sm", !p.online && "opacity-50")}>
                  <span className="grid place-items-center size-7 rounded-full btn-primary text-xs font-black">{p.name.charAt(0).toUpperCase()}</span>
                  {p.name}{p.className && <span className="text-xs text-ink-3">{p.className}</span>}
                  <button onClick={() => onKick(p.id)} aria-label={`Mời ${p.name} ra khỏi phòng`} title="Mời ra khỏi phòng"
                    className="grid place-items-center size-6 rounded-full text-ink-3 hover:bg-red-50 hover:text-bad cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100">
                    <X className="size-3.5" aria-hidden />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </div>
  );
}

function QuestionStage({ v, offset }: { v: HostView; offset: number }) {
  const q = v.question!;
  const revealed = v.phase === "reveal" && v.reveal;
  const { left, ms } = useCountdown(v.deadline, offset);
  const totalMs = v.config.seconds * 1000;
  const ticked = useRef("");
  useEffect(() => {
    if (v.phase !== "question" || left < 1 || left > 5) return;
    const k = `${v.qIndex}:${left}`;
    if (ticked.current === k) return;
    ticked.current = k;
    sfx.tick(left);
  }, [v.phase, v.qIndex, left]);
  const totalVotes = revealed ? v.reveal!.counts.reduce((a, b) => a + b, 0) + v.reveal!.noAnswer : 0;
  const maxCount = revealed ? Math.max(1, ...v.reveal!.counts) : 1;
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="pill !bg-white font-black text-deep">Câu {v.qIndex + 1}/{v.total}</span>
        <SubjectBadge subject={q.subject as never} />
        <div className="ml-auto flex items-center gap-3">
          {v.phase === "question" && <span className="pill !bg-white font-bold"><Users className="size-4" aria-hidden /> {v.answered}/{v.players.length} đã trả lời</span>}
          {v.phase === "question" && <Ring left={left} pct={ms / totalMs} />}
        </div>
      </div>

      <div className="glass p-5 sm:p-8 grid place-items-center text-center min-h-[22vh]">
        <MathText text={q.content} className="block font-black text-ink leading-snug text-[clamp(1.3rem,.9rem+2vw,3rem)]" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {q.options.map((o, i) => {
          const s = answerStyle(i);
          const isRight = revealed && v.reveal!.answerIndex === i;
          const dim = revealed && !isRight;
          const n = revealed ? v.reveal!.counts[i] : 0;
          return (
            <div key={i} className={cx("relative overflow-hidden rounded-[22px] text-white transition-opacity duration-300", dim && "opacity-45")}
              style={{ background: s.color, boxShadow: isRight ? `0 0 0 4px #fff, 0 0 0 8px ${s.color}` : undefined }}>
              <div className="relative flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 min-h-[4.5rem]">
                <span className="grid place-items-center size-11 sm:size-12 rounded-2xl bg-white/20 shrink-0"><AnswerGlyph i={i} className="size-6 sm:size-7" /></span>
                <span className="font-black text-2xl w-6 shrink-0">{s.letter}</span>
                <MathText text={o} className="font-extrabold leading-snug text-[clamp(1rem,.85rem+.8vw,1.75rem)] flex-1" />
                {isRight && <Check className="size-8 shrink-0" strokeWidth={3.5} aria-label="Đáp án đúng" />}
              </div>
              {revealed && (
                // Thanh đếm số học sinh chọn đáp án này (chiều dài theo số lượng, số ghi trực tiếp)
                <div className="relative px-4 sm:px-5 pb-3 flex items-center gap-3">
                  <div className="flex-1 h-3 rounded-full bg-black/20 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: `${(n / maxCount) * 100}%` }} transition={{ duration: 0.7, ease: "easeOut" }} />
                  </div>
                  <span className="font-black tabular-nums text-lg min-w-[3ch] text-right">{n}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {revealed && (
        <div className="flex flex-wrap items-start gap-3">
          <p className="pill !bg-white font-bold">
            {totalVotes ? Math.round((v.reveal!.counts[v.reveal!.answerIndex] / totalVotes) * 100) : 0}% trả lời đúng
            {v.reveal!.noAnswer ? ` · ${v.reveal!.noAnswer} bạn chưa trả lời` : ""}
          </p>
          {v.reveal!.explanation && (
            <div className="glass-soft rounded-2xl px-4 py-3 flex-1 min-w-[260px] text-ink-2">
              <span className="font-bold text-ink-3 text-sm block">{v.reveal!.explanationReviewed ? "Giải thích" : "Gợi ý giải thích (bản nháp)"}</span>
              <MathText text={v.reveal!.explanation} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Vòng đếm ngược */
function Ring({ left, pct }: { left: number; pct: number }) {
  const r = 26, c = 2 * Math.PI * r;
  const warn = left <= 5;
  return (
    <span className="relative grid place-items-center size-16 sm:size-20" role="timer" aria-label={`Còn ${left} giây`}>
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="#fff" stroke="#e0f2fe" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={warn ? "#dc2626" : "#0284c7"} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, pct)))} style={{ transition: "stroke-dashoffset .2s linear" }} />
      </svg>
      <span className={cx("relative font-black tabular-nums text-2xl sm:text-3xl", warn ? "text-bad" : "text-deep")}>{left}</span>
    </span>
  );
}

function RankDelta({ row }: { row: LiveRankRow }) {
  if (row.prevRank === null || row.prevRank === row.rank) return <span className="w-10" />;
  const up = row.rank < row.prevRank;
  return (
    <span className={cx("inline-flex items-center gap-0.5 text-sm font-black w-10", up ? "text-ok" : "text-bad")} aria-label={up ? `Tăng ${row.prevRank - row.rank} hạng` : `Giảm ${row.rank - row.prevRank} hạng`}>
      {up ? <ArrowUp className="size-4" aria-hidden /> : <ArrowDown className="size-4" aria-hidden />}{Math.abs(row.prevRank - row.rank)}
    </span>
  );
}

function Leaderboard({ rows, qIndex, total }: { rows: LiveRankRow[]; qIndex: number; total: number }) {
  const top = rows.slice(0, 6);
  return (
    <div className="flex-1 flex flex-col items-center">
      <h2 className="font-black text-[length:var(--fs-h1)] title-gradient text-center">Bảng xếp hạng</h2>
      <p className="text-ink-2 font-semibold">Sau câu {qIndex + 1}/{total}</p>
      <LayoutGroup>
        <ol className="mt-4 w-full max-w-3xl space-y-2">
          {top.map((r) => (
            <motion.li key={r.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="glass !rounded-2xl flex items-center gap-3 sm:gap-4 px-4 py-2.5">
              <span className={cx("grid place-items-center size-10 rounded-xl font-black text-lg shrink-0",
                r.rank === 1 ? "bg-amber-100 text-amber-800" : r.rank === 2 ? "bg-slate-200 text-slate-700" : r.rank === 3 ? "bg-orange-100 text-orange-800" : "bg-sky-50 text-deep")}>{r.rank}</span>
              <RankDelta row={r} />
              <span className="flex-1 min-w-0 font-extrabold text-ink text-[clamp(1rem,.9rem+.6vw,1.5rem)] truncate">{r.name}{r.className && <span className="ml-2 text-sm text-ink-3 font-semibold">{r.className}</span>}</span>
              {r.gained > 0 && <span className="text-ok font-black tabular-nums max-sm:hidden">+{r.gained}</span>}
              {r.streak >= 3 && <span className="pill !bg-amber-50 !text-amber-800 max-sm:hidden">🔥 {r.streak}</span>}
              <span className="font-black text-deep tabular-nums text-[clamp(1.05rem,.95rem+.6vw,1.6rem)]">{r.score.toLocaleString("vi-VN")}</span>
            </motion.li>
          ))}
        </ol>
      </LayoutGroup>
      {rows.length > top.length && <p className="mt-3 text-ink-3 font-semibold">và {rows.length - top.length} bạn khác</p>}
    </div>
  );
}

function downloadCsv(v: HostView) {
  const esc = (s: string | number | null) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const lines = [["Hạng", "Tên", "Lớp", "Điểm", "Số câu đúng", "Tổng số câu"].map(esc).join(",")];
  for (const r of v.ranking) lines.push([r.rank, r.name, r.className, r.score, r.correct, v.total].map(esc).join(","));
  // BOM để Excel đọc đúng tiếng Việt
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `ket-qua-phong-${v.code}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Final({ v }: { v: HostView }) {
  const [first, second, third] = v.ranking;
  const podium = [
    { r: second, h: "h-28 sm:h-36", tone: "from-slate-300 to-slate-400", place: 2 },
    { r: first, h: "h-40 sm:h-52", tone: "from-amber-300 to-amber-500", place: 1 },
    { r: third, h: "h-20 sm:h-28", tone: "from-orange-300 to-orange-400", place: 3 },
  ];
  return (
    <div className="flex-1 flex flex-col items-center">
      <Confetti run={!!first} pieces={90} />
      <Trophy className="size-20 sm:size-24" />
      <h2 className="mt-2 font-black text-[length:var(--fs-h1)] title-gradient text-center">Vinh danh</h2>
      <div className="mt-6 w-full max-w-3xl grid grid-cols-3 items-end gap-3 sm:gap-5">
        {podium.map(({ r, h, tone, place }, i) => (
          <motion.div key={place} className="flex flex-col items-center text-center min-w-0"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: [0.6, 1.1, 0.2][i], type: "spring", stiffness: 180, damping: 20 }}>
            {r ? (<>
              <p className="font-black text-ink text-[clamp(.95rem,.8rem+.8vw,1.6rem)] truncate max-w-full">{r.name}</p>
              <p className="font-bold text-deep tabular-nums mb-2">{r.score.toLocaleString("vi-VN")} điểm</p>
            </>) : <p className="text-ink-3 mb-2">—</p>}
            <div className={cx("w-full rounded-t-3xl bg-gradient-to-b grid place-items-start justify-center pt-3 text-white font-black text-4xl shadow-[var(--shadow-card)]", h, tone)}>{place}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 w-full max-w-3xl glass p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-black text-ink text-lg inline-flex items-center gap-2"><TrophyIcon className="size-5 text-gold" aria-hidden /> Bảng điểm cả lớp ({v.ranking.length})</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="soft" icon={Download} onClick={() => downloadCsv(v)}>Tải CSV</Button>
            <Button size="sm" icon={Plus} onClick={() => setUrlParam("ma", null)}>Phòng mới</Button>
          </div>
        </div>
        <ol className="mt-3 max-h-[40vh] overflow-y-auto divide-y divide-sky-100">
          {v.ranking.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-2">
              <span className="w-8 text-center font-black text-ink-3 tabular-nums">{r.rank}</span>
              <span className="flex-1 min-w-0 truncate font-bold text-ink">{r.name}{r.className && <span className="ml-2 text-xs text-ink-3">{r.className}</span>}</span>
              <span className="text-sm text-ink-3 tabular-nums">{r.correct}/{v.total} đúng</span>
              <span className="w-20 text-right font-black text-deep tabular-nums">{r.score.toLocaleString("vi-VN")}</span>
            </li>
          ))}
        </ol>
      </div>
      <Link href="/" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-3 hover:text-deep">Về trang chủ <ChevronRight className="size-4" aria-hidden /></Link>
    </div>
  );
}
