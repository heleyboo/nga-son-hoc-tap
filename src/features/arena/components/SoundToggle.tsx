"use client";
import { Volume2, VolumeX } from "lucide-react";
import { toggleSfx, useSfxMuted } from "@/lib/sfx";
import { cx } from "./ui";

/** Nút loa bật/tắt hiệu ứng âm thanh (nhớ lựa chọn trên máy) */
export function SoundToggle({ className }: { className?: string }) {
  const muted = useSfxMuted();
  const label = muted ? "Bật âm thanh" : "Tắt âm thanh";
  return (
    <button type="button" onClick={toggleSfx} aria-pressed={!muted} aria-label={label} title={label}
      className={cx("inline-grid place-items-center size-12 rounded-2xl bg-white/80 text-deep border border-white shadow-[0_6px_16px_-10px_rgba(2,132,199,.5)] hover:bg-white transition cursor-pointer",
        muted && "!text-ink-3", className)}>
      {muted ? <VolumeX className="size-5" aria-hidden /> : <Volume2 className="size-5" aria-hidden />}
    </button>
  );
}
