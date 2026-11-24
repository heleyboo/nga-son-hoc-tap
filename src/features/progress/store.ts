"use client";
/**
 * Tiến trình phía trình duyệt.
 *  - Đã đăng nhập: hỏi máy chủ (/api/progress), kết quả game gửi lên /api/games/result.
 *  - Khách: lượt chơi game lưu ở localStorage, XP tính bằng cùng luật (progress-rules.ts).
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { loadHistory } from "@/features/arena/lib/storage";
import {
  GAME_RULES, gameXp, summarize, vnDay, type GamePlay, type GameResult, type ProgressInput, type ProgressSummary,
} from "@/lib/progress-rules";

const KEY = "dttt.v1.games";

export function loadLocalPlays(): GamePlay[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as GamePlay[]; } catch { return []; }
}
function saveLocalPlay(p: GamePlay) {
  try { localStorage.setItem(KEY, JSON.stringify([...loadLocalPlays(), p].slice(-300))); } catch { /* bộ nhớ bị chặn */ }
}

export function localInput(): ProgressInput {
  return {
    arena: loadHistory().map((h) => ({ mode: h.mode, correct: h.correct, isRetry: h.isRetry, at: h.date })),
    daily: [], assignments: [], games: loadLocalPlays(),
  };
}

/* ---- báo cho các hook biết tiến trình vừa đổi (sau mỗi lượt chơi) ---- */
let version = 0;
const listeners = new Set<() => void>();
export function progressChanged() { version++; listeners.forEach((l) => l()); }
const sub = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
const useVersion = () => useSyncExternalStore(sub, () => version, () => 0);

export type RecordOutcome =
  | { saved: "account"; xp: number; capped: boolean; rank: ProgressSummary["rank"] }
  | { saved: "device"; xp: number; capped: boolean; rank: ProgressSummary["rank"] }
  | { saved: "none"; reason: string };

/** Ghi kết quả game: thử máy chủ trước; chưa đăng nhập thì lưu trên máy */
export async function recordGameResult(r: GameResult): Promise<RecordOutcome> {
  try {
    const res = await fetch("/api/games/result", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
    if (res.ok) {
      const d = await res.json() as { xp: number; capped: boolean; progress: { rank: ProgressSummary["rank"] } };
      progressChanged();
      return { saved: "account", xp: d.xp, capped: d.capped, rank: d.progress.rank };
    }
    if (res.status !== 401) return { saved: "none", reason: ((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Không ghi được kết quả" };
  } catch { /* mất mạng → lưu trên máy */ }
  // khách: áp cùng luật kiểm tra như máy chủ
  const bad = GAME_RULES[r.game].check(r);
  if (bad) return { saved: "none", reason: bad };
  const now = Date.now();
  const last = loadLocalPlays().filter((p) => p.game === r.game).at(-1);
  if (last && now - last.at < 8000) return { saved: "none", reason: "Kết quả vừa được ghi" };
  const today = loadLocalPlays().filter((p) => p.game === r.game && vnDay(p.at) === vnDay(now)).length;
  const xp = gameXp(r, today);
  saveLocalPlay({ ...r, xp, at: now });
  progressChanged();
  return { saved: "device", xp, capped: xp === 0, rank: summarize(localInput()).rank };
}

export type ServerProgress = ProgressSummary & { recentGames: GamePlay[] };

/** Tiến trình hiện tại: tài khoản (máy chủ) hoặc khách (trên máy) */
export function useProgress(signedIn: boolean, ready: boolean) {
  const v = useVersion();
  const [server, setServer] = useState<{ key: string; data: ServerProgress } | null>(null);
  const key = `${signedIn}-${v}`;
  useEffect(() => {
    if (!ready || !signedIn) return;
    let alive = true;
    fetch("/api/progress", { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<ServerProgress>) : null))
      .then((d) => { if (alive && d) setServer({ key, data: d }); })
      .catch(() => {});
    return () => { alive = false; };
  }, [ready, signedIn, key]);
  const isClient = useSyncExternalStore(sub, () => true, () => false);
  if (!ready) return null;
  if (signedIn) return server?.data ?? null;
  if (!isClient) return null;
  const input = localInput();
  return { ...summarize(input), recentGames: input.games.slice(-12).reverse() } as ServerProgress;
}
