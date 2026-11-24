"use client";
/**
 * Trạng thái cài ứng dụng (PWA) dùng chung:
 *  - Android/Chrome/Edge: trình duyệt bắn sự kiện beforeinstallprompt → giữ lại, bấm nút thì hiện hộp “Cài đặt”.
 *  - iPhone/iPad (Safari): không có sự kiện đó → hiện hướng dẫn “Chia sẻ → Thêm vào MH chính”.
 *  - Đã mở dưới dạng app (standalone) → ẩn nút.
 */
import { useSyncExternalStore } from "react";

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
export type InstallMode = "prompt" | "ios" | "installed" | "none";

let deferred: PromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e as PromptEvent; emit(); });
  window.addEventListener("appinstalled", () => { installed = true; deferred = null; emit(); });
}

function mode(): InstallMode {
  if (installed) return "installed";
  const standalone = window.matchMedia?.("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
  if (standalone) return "installed";
  if (deferred) return "prompt";
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "none";
}

/** Trình duyệt trên iPhone: cách cài khác nhau (Zalo/Facebook… không cài được, phải mở bằng Safari) */
export type IosBrowser = "safari" | "chrome" | "inapp" | "other";
export function iosBrowser(): IosBrowser {
  if (typeof navigator === "undefined") return "safari";
  const ua = navigator.userAgent;
  if (/Zalo|FBAN|FBAV|FB_IAB|Instagram|Messenger|Line\/|TikTok|musical_ly/i.test(ua)) return "inapp";
  if (/CriOS/.test(ua)) return "chrome";
  if (/FxiOS|EdgiOS|OPiOS/.test(ua)) return "other";
  return "safari";
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
export const useInstallMode = () => useSyncExternalStore(subscribe, mode, () => "none" as InstallMode);

/** Hiện hộp cài đặt của trình duyệt; trả về true nếu người dùng đồng ý */
export async function promptInstall() {
  if (!deferred) return false;
  const e = deferred;
  deferred = null;
  await e.prompt();
  const { outcome } = await e.userChoice;
  if (outcome === "accepted") installed = true;
  emit();
  return outcome === "accepted";
}
