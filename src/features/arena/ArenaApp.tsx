"use client";
import { progressChanged } from "@/features/progress/store";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { once, useIsClient } from "./lib/client";
import { useToast } from "./components/Toast";
import { TopBar } from "./components/TopBar";
import type { Catalog, GameConfig, Grade, HistoryEntry, RoundResult } from "./data/types";
import { earnedBadgeIds } from "./game/badges";
import { shuffle, shuffleOptions } from "./game/engine";
import { fetchCatalog, fetchMyHistory, fetchRound, submitAttempt } from "./lib/api";
import { useSession } from "./lib/session";
import { bestsFrom, clearHistory, loadHistory, loadProfile, pushHistory, saveProfile, storageAvailable, type Profile } from "./lib/storage";
import { Achievements } from "./screens/Achievements";
import { Config } from "./screens/Config";
import { Feedback } from "./screens/Feedback";
import { GradeSelect } from "./screens/GradeSelect";
import { Quiz, type ActiveRound } from "./screens/Quiz";
import { Results, type ResultMeta } from "./screens/Results";
import { Review } from "./screens/Review";
import { Welcome } from "./screens/Welcome";

type Screen = "welcome" | "grade" | "config" | "quiz" | "results" | "review" | "feedback" | "achievements";

const EMPTY_PROFILE: Profile = { name: "", className: "" };
const noopSub = () => () => {};
const DEFAULT_CONFIG: Omit<GameConfig, "grade"> = { level: "basic", subjects: [], count: 10, mode: "practice" };

export function ArenaApp() {
  const reduce = useReducedMotion();
  const toast = useToast();
  const { me, ready } = useSession();

  const isClient = useIsClient();
  // Dữ liệu trên trình duyệt chỉ đọc sau hydrate để HTML server/client khớp nhau
  const [profileEdit, setProfile] = useState<Profile | null>(null);
  const profile = profileEdit ?? (isClient ? once("profile", loadProfile) : EMPTY_PROFILE);
  const storageOk = isClient ? once("storage", storageAvailable) : true;
  const urlView = useSyncExternalStore(noopSub, () => new URLSearchParams(location.search).get("view"), () => null);

  const [screenState, setScreen] = useState<Screen | null>(null);
  const screen: Screen = screenState ?? (urlView === "thanh-tich" ? "achievements" : "welcome");
  const [returnTo, setReturnTo] = useState<Screen>("welcome");
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadingRound, setLoadingRound] = useState(false);
  const [round, setRound] = useState<ActiveRound | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [meta, setMeta] = useState<ResultMeta>({ newRecord: false, newBadges: [], save: "saved", rank: null });
  const [attemptId, setAttemptId] = useState<number | undefined>();
  const [viewKey, setViewKey] = useState(0);

  const go = useCallback((s: Screen) => {
    setScreen(s);
    if (location.search) window.history.replaceState(null, "", location.pathname); // bỏ ?view=… sau lần đầu
    window.scrollTo({ top: 0 });
  }, []);

  /* ---------- khởi tạo ---------- */
  useEffect(() => {
    fetchCatalog().then(setCatalog).catch(() => toast("Không tải được kho câu hỏi. Kiểm tra kết nối nhé.", "info"));
    const p = new URLSearchParams(location.search);
    if (p.has("loginError")) toast("Đăng nhập chưa thành công. Tài khoản có thể không thuộc tên miền của trường.", "info");
  }, [toast]);

  /* ---------- lịch sử: theo tài khoản nếu đã đăng nhập, ngược lại trên máy này ---------- */
  const [localVersion, bumpLocal] = useState(0);
  const localHistory = useMemo(() => (isClient ? loadHistory() : []), [isClient, localVersion]); // eslint-disable-line react-hooks/exhaustive-deps
  const [account, setAccount] = useState<{ uid: string; items: HistoryEntry[]; v: number } | null>(null);
  const [accountVersion, bumpAccount] = useState(0);
  useEffect(() => {
    if (!me) return;
    let alive = true;
    fetchMyHistory()
      .then((items) => { if (alive) setAccount({ uid: me.id, items, v: accountVersion }); })
      .catch(() => { if (alive) { setAccount({ uid: me.id, items: [], v: accountVersion }); toast("Không tải được lịch sử từ máy chủ.", "info"); } });
    return () => { alive = false; };
  }, [me, accountVersion, toast]);
  const history: HistoryEntry[] | null = !ready ? null : me ? (account?.uid === me.id ? account.items : null) : localHistory;
  const reloadHistory = useCallback(() => { if (me) bumpAccount((v) => v + 1); else bumpLocal((v) => v + 1); }, [me]);

  const playerName = me?.nickname ?? profile.name;
  const playerClass = me?.className ?? profile.className;

  /* ---------- luồng chơi ---------- */
  const startRound = async (cfg: GameConfig, retryFrom?: RoundResult) => {
    if (loadingRound) return;
    setLoadingRound(true);
    try {
      let questions;
      if (retryFrom) {
        // Làm lại câu sai: dùng lại đúng các câu đó, xáo lại thứ tự và đáp án, xóa đáp án đã biết để chấm lại
        questions = shuffle(retryFrom.questions.filter((_, i) => !retryFrom.answers[i]?.correct))
          .map((q) => shuffleOptions({ ...q, answer: undefined, explain: undefined, explainStatus: undefined }));
      } else {
        questions = await fetchRound(cfg);
      }
      if (!questions.length) { toast("Chưa có câu hỏi phù hợp với lựa chọn này.", "info"); return; }
      setRound({ key: Math.random().toString(36), config: cfg, questions, isRetry: !!retryFrom, player: playerName, className: playerClass });
      go("quiz");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Không tải được đề.", "info");
    } finally {
      setLoadingRound(false);
    }
  };

  const saveResult = useCallback(async (r: RoundResult) => {
    setMeta((m) => ({ ...m, save: "saving" }));
    try {
      const res = await submitAttempt({
        playerName: r.player || "Khách", className: r.className || undefined,
        grade: r.config.grade, level: r.config.level, mode: r.config.mode,
        durationSec: Math.round(r.durationMs / 1000), isRetry: r.isRetry,
        answers: r.questions.map((q, i) => ({
          questionId: q.dbId,
          selectedIndex: r.answers[i]?.selected == null ? null : q.optionOrigin[r.answers[i].selected!],
          timeMs: r.answers[i]?.timeMs ?? 0,
        })),
      });
      setAttemptId(res.attemptId);
      // Điểm chính thức do server chấm
      setResult((cur) => (cur && cur.id === r.id ? { ...cur, score: res.score, maxStreak: res.maxStreak } : cur));
      setMeta((m) => ({ ...m, save: "saved", rank: res.rank ? { position: res.rank.position, total: res.rank.total } : null }));
      if (me) reloadHistory();
      progressChanged();
    } catch {
      setMeta((m) => ({ ...m, save: "error" }));
    }
  }, [me, reloadHistory]);

  const finishRound = (r: RoundResult) => {
    const before = history ?? [];
    const entry: HistoryEntry = {
      id: r.id, date: r.date, grade: r.config.grade, level: r.config.level, mode: r.config.mode,
      correct: r.correct, total: r.total, score: r.score, maxStreak: r.maxStreak, durationMs: r.durationMs, isRetry: r.isRetry,
    };
    const after = [entry, ...before];
    const had = earnedBadgeIds(before), now = earnedBadgeIds(after);
    const key = `${r.config.grade}-${r.config.level}-${r.config.mode}`;
    const prevBest = bestsFrom(before)[key], nextBest = bestsFrom(after)[key];
    const newRecord = !r.isRetry && !!prevBest && nextBest?.date === r.date;
    if (me) setAccount((a) => (a && a.uid === me.id ? { ...a, items: after } : a));
    else { pushHistory(r); bumpLocal((v) => v + 1); progressChanged(); }
    setResult(r);
    setAttemptId(undefined);
    setMeta({ newRecord, newBadges: [...now].filter((id) => !had.has(id)), save: "saving", rank: null });
    go("results");
    void saveResult(r);
  };

  const openAside = (s: "feedback" | "achievements") => {
    if (screen !== "feedback" && screen !== "achievements") setReturnTo(screen === "quiz" ? "welcome" : screen);
    setViewKey((k) => k + 1);
    if (s === "achievements") reloadHistory();
    go(s);
  };

  /* ---------- render ---------- */
  let view: ReactNode = null;
  switch (screen) {
    case "welcome":
      view = <Welcome key={me ? `u:${me.id}` : `g:${profile.name}|${profile.className}`} profile={profile}
        onStart={(p) => { setProfile(p); saveProfile(p); go("grade"); }}
        onAchievements={() => openAside("achievements")} />;
      break;
    case "grade":
      view = <GradeSelect current={config?.grade ?? null} player={playerName} catalog={catalog} bests={bestsFrom(history ?? [])}
        onPick={(g: Grade) => { setConfig((c) => ({ ...(c ?? DEFAULT_CONFIG), grade: g, subjects: c?.grade === g ? c.subjects : [] })); go("config"); }}
        onBack={() => go("welcome")} />;
      break;
    case "config":
      view = config && <Config config={config} catalog={catalog} loading={loadingRound} onChange={setConfig}
        onStart={() => void startRound(config)} onBack={() => go("grade")} />;
      break;
    case "quiz":
      view = round && <Quiz key={round.key} round={round} onFinish={finishRound} onExit={() => go("config")} />;
      break;
    case "results":
      view = result && <Results result={result} meta={meta} attemptId={attemptId}
        onRetrySave={() => void saveResult(result)}
        onReplay={() => void startRound(result.config)}
        onRetryWrong={() => void startRound(result.config, result)}
        onReview={() => go("review")}
        onChangeSet={() => { setConfig(result.config); go("config"); }}
        onHome={() => go("welcome")}
        onFeedback={() => { setReturnTo("results"); setViewKey((k) => k + 1); go("feedback"); }} />;
      break;
    case "review":
      view = result && <Review result={result} onBack={() => go("results")} onRetryWrong={() => void startRound(result.config, result)} />;
      break;
    case "feedback":
      view = <Feedback key={viewKey} player={playerName}
        context={result ? { grade: result.config.grade, level: result.config.level, attemptId } : null}
        onBack={() => go(returnTo)} onHome={() => go("welcome")} />;
      break;
    case "achievements":
      view = <Achievements key={viewKey} profile={{ name: playerName, className: playerClass ?? "" }}
        history={history} source={me ? "account" : "device"}
        onClear={() => { clearHistory(); bumpLocal((v) => v + 1); }}
        onBack={() => go(returnTo)} onPlay={() => go(playerName ? "grade" : "welcome")} />;
      break;
  }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] pill">Bỏ qua tới nội dung</a>
      {screen !== "quiz" && (
        <TopBar player={playerName} onHome={() => go("welcome")} onAchievements={() => openAside("achievements")} onFeedback={() => openAside("feedback")} />
      )}
      {!storageOk && !me && (
        <div className="container-arena mb-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2 text-[var(--fs-small)] text-amber-900 font-semibold" role="status">
          Trình duyệt đang chặn lưu trữ — hãy đăng nhập Google để giữ điểm và lịch sử.
        </div>
      )}
      <main id="main" className="flex-1 pt-1 sm:pt-3">
        <AnimatePresence mode="wait">
          <motion.div key={screen + viewKey}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            {view}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
