"use client";
import { Check, Copy, Download, Loader2, Share2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/features/arena/components/Toast";
import { Button, Modal } from "@/features/arena/components/ui";

type Req = { kind: "daily"; runId: number; token: string; name?: string | null } | { kind: "arena"; attemptId: number };
interface Created { slug: string; url: string; path: string; image: string }

/**
 * Nút "Chia sẻ thành tích": tạo thẻ ở server rồi mở hộp chia sẻ (ảnh xem trước, Zalo/Messenger qua
 * bảng chia sẻ của điện thoại, Facebook, chép link, tải ảnh).
 */
export function ShareButton({ req, label = "Chia sẻ thành tích", block, variant = "gold" }: {
  req: Req | null; label?: string; block?: boolean; variant?: "gold" | "soft" | "primary";
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [card, setCard] = useState<Created | null>(null);
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const create = async () => {
    if (!req) return;
    setBusy(true);
    try {
      const res = await fetch("/api/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Không tạo được thẻ");
      setCard(d); setImgLoaded(false); setOpen(true);
    } catch (e) { toast((e as Error).message, "info"); }
    finally { setBusy(false); }
  };

  const text = "Mình vừa hoàn thành thử thách trên Web Học Tập THCS Nga Sơn — bạn có làm tốt hơn không?";
  const nativeShare = async () => {
    if (!card) return;
    try {
      // ưu tiên gửi kèm ảnh (Zalo, Messenger trên điện thoại nhận được ảnh)
      const blob = await fetch(card.image).then((r) => r.blob());
      const file = new File([blob], `thanh-tich-${card.slug}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: "Thành tích của mình", text: `${text} ${card.url}` });
      else await navigator.share({ title: "Thành tích của mình", text, url: card.url });
    } catch { /* người dùng huỷ */ }
  };
  const copy = async () => {
    if (!card) return;
    try { await navigator.clipboard.writeText(card.url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { toast("Không chép được, hãy chép thủ công đường dẫn bên dưới", "info"); }
  };
  const canNative = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <>
      <Button variant={variant} block={block} icon={busy ? Loader2 : Share2} disabled={!req || busy} onClick={() => void create()}>{label}</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Chia sẻ thành tích" wide>
        {card && (
          <div className="space-y-4">
            <div className="relative rounded-[20px] overflow-hidden bg-sky-50 aspect-[1200/630]">
              {!imgLoaded && <div className="absolute inset-0 grid place-items-center"><Loader2 className="size-7 animate-spin text-sky-brand" aria-hidden /></div>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.image} alt="Thẻ thành tích" className="w-full h-full object-cover" onLoad={() => setImgLoaded(true)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {canNative && <Button icon={Share2} onClick={() => void nativeShare()} className="sm:col-span-2">Gửi qua Zalo, Messenger…</Button>}
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(card.url)}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-[var(--radius-ctl)] font-extrabold text-white bg-[#1877f2] hover:brightness-105">
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" /></svg>
                Chia sẻ lên Facebook
              </a>
              <a href={`${card.image}?tai=1`} download={`thanh-tich-${card.slug}.png`}
                className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-[var(--radius-ctl)] font-extrabold bg-white/90 text-deep border border-sky-100 hover:bg-white">
                <Download className="size-5" aria-hidden /> Tải ảnh về máy
              </a>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-white p-1.5 pl-3">
              <span className="flex-1 min-w-0 truncate text-sm font-semibold text-ink-2">{card.url}</span>
              <Button size="sm" variant="soft" icon={copied ? Check : Copy} onClick={() => void copy()}>{copied ? "Đã chép" : "Chép link"}</Button>
            </div>
            <p className="text-xs text-ink-3">Dán link vào Zalo hoặc Facebook sẽ hiện ảnh thẻ này. Ảnh chỉ có điểm, tên hiển thị và lớp — không có email hay thông tin khác.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
