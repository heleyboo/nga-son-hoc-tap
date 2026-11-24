"use client";
import { WifiOff, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import "./install";

// thời điểm mất mạng gần nhất (0 = đang có mạng) — mỗi lần mất mạng là một “lượt” báo mới
let offlineSince = 0;
const sub = (cb: () => void) => {
  const on = () => { offlineSince = 0; cb(); };
  const off = () => { offlineSince = Date.now(); cb(); };
  window.addEventListener("online", on); window.addEventListener("offline", off);
  return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
};
const snapshot = () => (navigator.onLine ? 0 : offlineSince || (offlineSince = 1));
const useOfflineSince = () => useSyncExternalStore(sub, snapshot, () => 0);

/** Gắn ở layout gốc: đăng ký service worker (chỉ bản production) + thông báo mất mạng */
export function PwaClient() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const reg = () => navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
    if (document.readyState === "complete") reg(); else window.addEventListener("load", reg, { once: true });
  }, []);
  const since = useOfflineSince();
  return since ? <OfflineNotice key={since} /> : null;
}

/** Hiện đầy đủ 7 giây rồi thu lại thành biểu tượng nhỏ ở góc (không che trò chơi); bấm vào để xem lại */
function OfflineNotice() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(false), 7000);
    return () => window.clearTimeout(t);
  }, [open]);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} aria-label="Đang mất kết nối mạng — xem chi tiết"
        className="fixed z-[90] left-3 bottom-[max(12px,env(safe-area-inset-bottom))] grid place-items-center size-11 rounded-full bg-slate-900/90 text-amber-300 shadow-xl cursor-pointer">
        <WifiOff className="size-5" aria-hidden />
      </button>
    );
  }
  return (
    <div role="status" className="fixed z-[90] left-1/2 -translate-x-1/2 bottom-[max(12px,env(safe-area-inset-bottom))] w-[min(92vw,520px)] rounded-2xl bg-slate-900/95 text-white pl-4 pr-2 py-2.5 shadow-2xl flex items-center gap-3 text-sm font-semibold">
      <WifiOff className="size-5 shrink-0 text-amber-300" aria-hidden />
      <span className="flex-1">Đang mất kết nối mạng. Trò chơi STEM vẫn chơi được; làm bài và bảng xếp hạng cần có mạng.</span>
      <button type="button" onClick={() => setOpen(false)} aria-label="Thu gọn thông báo" className="grid place-items-center size-10 rounded-xl hover:bg-white/10 cursor-pointer shrink-0"><X className="size-5" aria-hidden /></button>
    </div>
  );
}
