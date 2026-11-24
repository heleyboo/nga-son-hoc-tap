"use client";
import { Gamepad2, Info, Sparkles, Swords } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GAMES } from "@/lib/modules";
import { GAME_RULES } from "@/lib/progress-rules";
import { TopBar } from "./components/TopBar";
import { Card, ScreenTitle, cx } from "./components/ui";
import { Avatar, LeaderboardView, RankBadge, Seg, fmtTime } from "./LeaderboardView";
import type { BoardQuery } from "./lib/api";
import { useSession } from "./lib/session";

export type BoardKind = "arena" | "xp" | "game";
type Period = "week" | "month" | "all";
const PERIODS = [{ k: "week", label: "Tuần này" }, { k: "month", label: "Tháng này" }, { k: "all", label: "Mọi lúc" }];
const SCORE_GAMES = GAMES.filter((g) => GAME_RULES[g.slug].kind === "score");

function setParam(k: string, v: string | null) {
  const u = new URL(window.location.href);
  if (v === null) u.searchParams.delete(k); else u.searchParams.set(k, v);
  window.history.replaceState(null, "", u);
}

function Switcher({ kind, onChange }: { kind: BoardKind; onChange: (k: BoardKind) => void }) {
  const tabs: { k: BoardKind; label: string; Icon: typeof Swords }[] = [
    { k: "arena", label: "Đấu Trường", Icon: Swords }, { k: "xp", label: "Điểm XP", Icon: Sparkles }, { k: "game", label: "Trò chơi", Icon: Gamepad2 },
  ];
  return (
    <div role="tablist" aria-label="Loại bảng xếp hạng" className="mb-3 grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white/70 border border-white">
      {tabs.map((t) => (
        <button key={t.k} role="tab" aria-selected={kind === t.k} onClick={() => onChange(t.k)}
          className={cx("min-h-11 px-2 rounded-xl font-extrabold text-[var(--fs-small)] inline-flex items-center justify-center gap-1.5 cursor-pointer transition",
            kind === t.k ? "btn-primary !shadow-none" : "text-ink-2 hover:bg-white")}>
          <t.Icon className="size-4 max-sm:hidden" aria-hidden /> {t.label}
        </button>
      ))}
    </div>
  );
}

/** Trang bảng xếp hạng: 3 loại bảng chung một chỗ */
export function BoardsHub({ initial, initialKind }: { initial: BoardQuery; initialKind: BoardKind }) {
  const [kind, setKind] = useState<BoardKind>(initialKind);
  const change = (k: BoardKind) => { setKind(k); setParam("bang", k === "arena" ? null : k); };
  const switcher = <Switcher kind={kind} onChange={change} />;
  if (kind === "arena") return <LeaderboardView initial={initial} switcher={switcher} />;
  return <ExtraBoard kind={kind} switcher={switcher} />;
}

type Row = { rank: number; name: string; className: string | null; isMe: boolean; xp?: number; score?: number; correct?: number | null; durationSec?: number | null };
type BoardData = { total: number; items: Row[]; me: Row | null };

function ExtraBoard({ kind, switcher }: { kind: "xp" | "game"; switcher: React.ReactNode }) {
  const { me, ready, googleEnabled, signIn } = useSession();
  const [period, setPeriod] = useState<Period>(kind === "xp" ? "week" : "all");
  const [game, setGame] = useState(SCORE_GAMES[0].slug);
  const [total, setTotal] = useState(GAME_RULES[SCORE_GAMES[0].slug].modes[0]);
  const url = kind === "xp" ? `/api/leaderboard/xp?period=${period}` : `/api/leaderboard/games?game=${game}&total=${total}&period=${period}`;
  const [res, setRes] = useState<{ url: string; data: BoardData | null; error: boolean } | null>(null);
  useEffect(() => {
    if (!ready) return;
    let alive = true;
    fetch(url, { cache: "no-store" }).then((r) => (r.ok ? r.json() : Promise.reject(new Error()))).then(
      (d: BoardData) => { if (alive) setRes({ url, data: d, error: false }); },
      () => { if (alive) setRes({ url, data: null, error: true }); });
    return () => { alive = false; };
  }, [url, ready, me]);
  const data = res?.url === url ? res.data : null;
  const loading = res?.url !== url;
  const g = GAMES.find((x) => x.slug === game)!;
  const value = (r: Row) => (kind === "xp" ? `${r.xp?.toLocaleString("vi-VN")} XP` : r.score?.toLocaleString("vi-VN"));
  const sub = (r: Row) => kind === "game" && [r.correct !== null && r.correct !== undefined ? `${r.correct}/${total} câu` : null, r.durationSec ? fmtTime(r.durationSec) : null].filter(Boolean).join(" · ");

  return (
    <>
      <TopBar active="leaderboard" />
      <main id="main" className="flex-1 pt-1 sm:pt-3 pb-28">
        <div className="container-arena">
          <ScreenTitle title="Bảng xếp hạng" sub={kind === "xp" ? "Điểm Tri Thức kiếm được từ mọi hoạt động" : `Kỷ lục ${g.title}`} />
          {switcher}
          <Card className="p-3 sm:p-4 grid gap-3 md:grid-cols-2 md:gap-x-6">
            {kind === "game" && <>
              <Seg label="Trò chơi" value={game} className="md:col-span-2" onChange={(v) => { const s = v as typeof game; setGame(s); setTotal(GAME_RULES[s].modes[0]); }}
                options={SCORE_GAMES.map((x) => ({ k: x.slug, label: x.title.split(" ").slice(0, 2).join(" "), color: x.from }))} />
              <Seg label="Chế độ" value={String(total)} onChange={(v) => setTotal(Number(v))}
                options={GAME_RULES[game].modes.map((m) => ({ k: String(m), label: game === "quy-dao" ? `${m} kỳ quan` : `${m} câu` }))} />
            </>}
            <Seg label="Thời gian" value={period} onChange={(v) => setPeriod(v as Period)} options={PERIODS} />
          </Card>

          {res?.error && !data && !loading && <Card className="mt-4 p-6 text-center text-ink-2">Không tải được bảng xếp hạng. Kiểm tra kết nối rồi thử lại.</Card>}
          {loading && <p className="mt-6 text-center text-ink-3 font-semibold">Đang tải…</p>}
          {data && data.items.length === 0 && (
            <Card className="mt-4 p-8 text-center">
              <p className="text-4xl" aria-hidden>{kind === "xp" ? "✨" : "🎮"}</p>
              <h2 className="mt-2 font-extrabold text-ink text-[length:var(--fs-h2)]">Chưa có ai ghi danh</h2>
              <Link href={kind === "xp" ? "/dau-truong" : `/tro-choi/${game}`} className="mt-4 inline-flex items-center gap-2 min-h-12 px-6 rounded-[18px] btn-primary font-extrabold">
                {kind === "xp" ? "Vào Đấu Trường" : `Chơi ${g.title}`}
              </Link>
            </Card>
          )}
          {data && data.items.length > 0 && (
            <Card className="mt-4 p-2 sm:p-3">
              <ol className="grid gap-1.5">
                {data.items.map((r) => (
                  <li key={`${r.rank}-${r.name}`} className={cx("flex items-center gap-3 rounded-2xl px-2.5 py-2 sm:px-3", r.isMe ? "bg-sky-50 border-2 border-sky-300" : "bg-white/70 border border-white")}>
                    <RankBadge rank={r.rank} />
                    <Avatar name={r.name} />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-ink truncate">{r.name}{r.isMe && <span className="ml-1.5 text-xs text-sky-700">(bạn)</span>}</div>
                      <div className="text-xs text-ink-3 font-medium">{[r.className && `Lớp ${r.className}`, sub(r)].filter(Boolean).join(" · ")}</div>
                    </div>
                    <div className="font-black text-ink tabular-nums shrink-0">{value(r)}</div>
                  </li>
                ))}
              </ol>
            </Card>
          )}
          <p className="mt-4 flex items-start gap-2 text-[var(--fs-small)] text-ink-3 font-medium">
            <Info className="size-4 mt-0.5 shrink-0" aria-hidden />
            {kind === "xp"
              ? "Điểm Tri Thức cộng từ Đấu Trường, thử thách mỗi ngày, bài tập và trò chơi STEM (mỗi trò tối đa 3 lượt được cộng mỗi ngày). Chỉ tính tài khoản Google."
              : "Mỗi tài khoản lấy lượt điểm cao nhất; bằng điểm thì ai nhanh hơn xếp trên. Kết quả vô lý (vượt điểm tối đa, xong quá nhanh) không được ghi."}
          </p>
        </div>
      </main>
      {ready && (
        <div className="fixed inset-x-0 bottom-0 z-30 pb-[max(10px,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
          <div className="container-arena">
            {me ? (data?.me && (
              <div className="glass !rounded-[22px] px-3 py-2.5 sm:px-4 flex items-center gap-3 border-2 !border-sky-300">
                <RankBadge rank={data.me.rank} />
                <div className="flex-1 min-w-0 font-extrabold text-ink truncate">Hạng của bạn · #{data.me.rank} trên {data.total}</div>
                <div className="font-black text-deep tabular-nums">{value(data.me)}</div>
              </div>
            )) : googleEnabled ? (
              <div className="glass !rounded-[22px] px-4 py-2.5 flex flex-wrap items-center gap-3">
                <span className="flex-1 min-w-[180px] font-semibold text-ink-2 text-[var(--fs-small)]">Đăng nhập Google để ghi danh và xem hạng của bạn.</span>
                <button onClick={() => void signIn()} className="min-h-11 px-4 rounded-2xl btn-primary font-extrabold text-[var(--fs-small)] cursor-pointer">Đăng nhập</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
