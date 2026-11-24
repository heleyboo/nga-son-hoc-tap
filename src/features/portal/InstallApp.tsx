"use client";
import { Download, Ellipsis, Share, SquarePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Modal } from "@/features/arena/components/ui";
import { iosBrowser, promptInstall, useInstallMode } from "@/lib/pwa/install";

const SNOOZE_KEY = "install-snooze-until";
const snoozed = () => { try { return Number(localStorage.getItem(SNOOZE_KEY) ?? 0) > Date.now(); } catch { return false; } };
const snooze = () => { try { localStorage.setItem(SNOOZE_KEY, String(Date.now() + 14 * 864e5)); } catch { /* bỏ qua */ } };

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <li className="flex gap-3"><span className="grid place-items-center size-8 rounded-full bg-sky-100 font-black text-deep shrink-0">{n}</span><span>{children}</span></li>
);
const ShareIcon = () => <Share className="inline size-5 text-sky-600 -mt-1" aria-label="(biểu tượng ô vuông có mũi tên hướng lên)" />;

/** Hướng dẫn cài trên iPhone/iPad, theo đúng trình duyệt đang dùng */
function IosGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const br = iosBrowser();
  const addSteps = (from: number) => (
    <>
      <Step n={from}>Kéo xuống, chọn <b>Thêm vào MH chính</b> <SquarePlus className="inline size-5 text-sky-600 -mt-1" aria-hidden /> (Add to Home Screen).</Step>
      <Step n={from + 1}>Bấm <b>Thêm</b>. Biểu tượng <b>THCS Nga Sơn</b> xuất hiện trên màn hình chính, mở ra như một ứng dụng.</Step>
    </>
  );
  return (
    <Modal open={open} onClose={onClose} title="Cài lên iPhone / iPad">
      {br === "inapp" ? (
        <>
          <p className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900 font-semibold">Em đang mở trang trong <b>Zalo/Facebook</b>. Trình duyệt bên trong các ứng dụng này không cài được, cần mở bằng Safari trước.</p>
          <ol className="mt-4 space-y-3 text-ink">
            <Step n={1}>Bấm nút <Ellipsis className="inline size-5 text-sky-600 -mt-1" aria-hidden /> ở góc trên bên phải, chọn <b>Mở bằng trình duyệt</b> / <b>Mở trong Safari</b>.</Step>
            <Step n={2}>Trong Safari, bấm nút <b>Chia sẻ</b> <ShareIcon /> ở thanh dưới cùng.</Step>
            {addSteps(3)}
          </ol>
        </>
      ) : (
        <ol className="space-y-3 text-ink">
          {br === "chrome"
            ? <Step n={1}>Bấm nút <b>Chia sẻ</b> <ShareIcon /> ở <b>bên phải thanh địa chỉ</b> (phía trên màn hình).</Step>
            : br === "other"
              ? <Step n={1}>Mở menu của trình duyệt và chọn <b>Chia sẻ</b> <ShareIcon />. Nếu không thấy, hãy mở trang bằng <b>Safari</b>.</Step>
              : <Step n={1}>Bấm nút <b>Chia sẻ</b> <ShareIcon /> ở thanh dưới cùng (nếu không thấy thanh, chạm nhẹ vào cuối màn hình).</Step>}
          {addSteps(2)}
        </ol>
      )}
      <div className="modal-actions"><Button onClick={onClose}>Đã hiểu</Button></div>
    </Modal>
  );
}

/** Nút “Cài ứng dụng”: Android bấm là cài; iPhone hiện hướng dẫn; đã cài hoặc trình duyệt không hỗ trợ thì ẩn */
export function InstallApp({ className }: { className?: string }) {
  const mode = useInstallMode();
  const [guide, setGuide] = useState(false);
  if (mode === "installed" || mode === "none") return null;
  return (
    <>
      <button type="button" onClick={() => (mode === "prompt" ? void promptInstall() : setGuide(true))}
        className={className ?? "inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-[18px] bg-white/90 text-deep border border-sky-100 font-extrabold hover:bg-white transition cursor-pointer"}>
        <Download className="size-5" aria-hidden /> Cài ứng dụng lên điện thoại
      </button>
      <IosGuide open={guide} onClose={() => setGuide(false)} />
    </>
  );
}

/** Gợi ý cài tự hiện ở đáy trang chủ sau vài giây (bấm “Để sau” thì ẩn 14 ngày) */
export function InstallBanner() {
  const mode = useInstallMode();
  const [show, setShow] = useState(false);
  const [guide, setGuide] = useState(false);
  const can = mode === "prompt" || mode === "ios";
  useEffect(() => {
    if (!can || snoozed()) return;
    const t = window.setTimeout(() => setShow(true), 3500);
    return () => window.clearTimeout(t);
  }, [can]);
  const later = () => { snooze(); setShow(false); };
  return (
    <>
      {show && can && !guide && (
        <div data-install-banner role="dialog" aria-label="Cài ứng dụng"
          className="fixed z-[80] left-1/2 -translate-x-1/2 bottom-[max(12px,env(safe-area-inset-bottom))] w-[min(94vw,480px)] rounded-[22px] bg-white p-3 pr-2 shadow-[0_24px_60px_-20px_rgba(2,132,199,.55)] border border-sky-100 flex items-center gap-3 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="" className="size-12 rounded-2xl shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-black text-ink leading-tight">Cài THCS Nga Sơn lên điện thoại</p>
            <p className="text-xs text-ink-3 font-semibold">Mở nhanh từ màn hình chính, chơi trò chơi cả khi mất mạng.</p>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => { if (mode === "prompt") { void promptInstall(); setShow(false); } else setGuide(true); }}
                className="min-h-10 px-4 rounded-xl btn-primary font-extrabold text-sm cursor-pointer">{mode === "prompt" ? "Cài đặt" : "Xem cách cài"}</button>
              <button type="button" onClick={later} className="min-h-10 px-3 rounded-xl text-ink-3 font-bold text-sm hover:bg-sky-50 cursor-pointer">Để sau</button>
            </div>
          </div>
          <button type="button" onClick={later} aria-label="Đóng" className="self-start grid place-items-center size-9 rounded-xl text-ink-3 hover:bg-sky-50 cursor-pointer"><X className="size-4.5" aria-hidden /></button>
        </div>
      )}
      <IosGuide open={guide} onClose={() => { setGuide(false); setShow(false); snooze(); }} />
    </>
  );
}
