import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, type LucideIcon } from "lucide-react";
import {
  forwardRef, useEffect, useId, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "../lib/client";
import { SUBJECTS } from "../data/meta";
import type { Subject } from "../data/types";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------------- Button ---------------- */
type Variant = "primary" | "gold" | "soft" | "ghost" | "danger";
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "md" | "lg" | "sm";
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  block?: boolean;
}
const variants: Record<Variant, string> = {
  primary: "btn-primary hover:brightness-105",
  gold: "btn-gold hover:brightness-105",
  soft: "bg-white/90 text-deep border border-sky-100 shadow-[0_6px_16px_-10px_rgba(2,132,199,.45)] hover:bg-white hover:border-sky-200",
  ghost: "bg-transparent text-deep hover:bg-white/70",
  danger: "bg-white text-bad border border-red-200 hover:bg-red-50",
};
const sizes = {
  sm: "min-h-11 px-3.5 text-[var(--fs-small)] rounded-[14px] gap-1.5",
  md: "min-h-12 px-5 text-[var(--fs-body)] rounded-[var(--radius-ctl)] gap-2",
  lg: "min-h-14 px-7 text-[clamp(1.02rem,.95rem+.4vw,1.4rem)] rounded-[20px] gap-2.5 tracking-wide",
};
export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "primary", size = "md", icon: Icon, iconRight: IconR, block, className, children, ...rest }, ref,
) {
  return (
    <button
      ref={ref}
      {...rest}
      className={cx(
        "relative inline-flex items-center justify-center font-extrabold select-none overflow-hidden",
        "transition-[transform,filter,background-color,box-shadow] duration-200 active:scale-[.97]",
        "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant], sizes[size], block && "w-full", className,
      )}
    >
      {Icon && <Icon aria-hidden className="size-[1.15em] shrink-0" strokeWidth={2.4} />}
      {children}
      {IconR && <IconR aria-hidden className="size-[1.15em] shrink-0" strokeWidth={2.4} />}
    </button>
  );
});

export function IconButton({ icon: Icon, label, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon; label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      {...rest}
      className={cx(
        "inline-grid place-items-center size-12 rounded-2xl bg-white/80 text-deep border border-white",
        "shadow-[0_6px_16px_-10px_rgba(2,132,199,.5)] hover:bg-white transition cursor-pointer active:scale-95",
        className,
      )}
    >
      <Icon aria-hidden className="size-5" strokeWidth={2.3} />
    </button>
  );
}

/* ---------------- Glass card ---------------- */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cx("glass", className)} />;
}

/* ---------------- Section heading ---------------- */
export function ScreenTitle({ eyebrow, title, sub }: { eyebrow?: ReactNode; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="text-center mb-5 sm:mb-7">
      {eyebrow && <div className="mb-2 flex justify-center">{eyebrow}</div>}
      <h1 className="font-black uppercase tracking-tight text-[length:var(--fs-h1)] leading-[1.1] title-gradient">{title}</h1>
      {sub && <p className="mt-2 text-ink-2 text-[length:var(--fs-body)]">{sub}</p>}
    </header>
  );
}

/* ---------------- Subject chip ---------------- */
export function SubjectBadge({ subject, size = "md" }: { subject: Subject; size?: "sm" | "md" }) {
  const m = SUBJECTS[subject];
  const Icon = m.icon;
  return (
    <span
      className={cx("inline-flex items-center gap-1.5 rounded-full font-bold whitespace-nowrap", size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-[var(--fs-small)]")}
      style={{ background: m.bg, color: m.fg }}
    >
      <Icon aria-hidden className="size-[1.05em]" strokeWidth={2.4} />
      {m.short}
    </span>
  );
}

/* ---------------- Selectable option (radio/checkbox semantics) ---------------- */
interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  role?: "radio" | "checkbox";
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  accent?: string;
}
export function OptionTile({ selected, onSelect, role = "radio", children, className, disabled, accent = "#0284c7" }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      role={role}
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={cx(
        "relative text-left rounded-[20px] border-2 transition-[background-color,border-color,box-shadow] duration-200 cursor-pointer",
        "disabled:opacity-45 disabled:cursor-not-allowed",
        selected ? "bg-white shadow-[0_12px_28px_-14px_rgba(2,132,199,.55)]" : "bg-white/80 border-sky-100/70 hover:bg-white hover:border-sky-200",
        className,
      )}
      style={selected ? { borderColor: accent } : undefined}
    >
      {children}
    </motion.button>
  );
}

/* ---------------- Progress ---------------- */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}
      className="h-2.5 sm:h-3 w-full rounded-full bg-sky-100/90 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg,#0284c7,#10b981)" }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

/* ---------------- Count-up ---------------- */
export function CountUp({ value, duration = 1.1, className, format = (n: number) => n.toLocaleString("vi-VN") }: { value: number; duration?: number; className?: string; format?: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  const prev = useRef(reduce ? value : 0);
  useEffect(() => {
    if (reduce) { prev.current = value; return; }
    const ctrl = animate(prev.current, value, {
      duration, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    prev.current = value;
    return () => ctrl.stop();
  }, [value, duration, reduce]);
  return <span className={className}>{format(reduce ? value : shown)}</span>;
}

/* ---------------- Modal ---------------- */
export function Modal({ open, onClose, title, children, labelledBy, dismissable = true, wide = false }: {
  open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; labelledBy?: string; dismissable?: boolean;
  /** khung rộng hơn cho biểu mẫu dài (trang giáo viên) */
  wide?: boolean;
}) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      const el = panel.current?.querySelector<HTMLElement>("[data-autofocus], button, textarea, input");
      el?.focus();
    }, 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) { e.stopPropagation(); onClose(); }
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button:not([disabled]), textarea, input, [tabindex='0']");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey, true); prevFocus?.focus?.(); };
  }, [open, onClose, dismissable]);

  // Gắn vào <body> qua portal: tránh bị "nhốt" trong khung cha có backdrop-filter/transform (position: fixed lệch chỗ)
  if (!isClient) return null;
  return createPortal(
    <div className="arena-portal">
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-3 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-sky-950/30 backdrop-blur-[3px]" onClick={dismissable ? onClose : undefined} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog" aria-modal="true" aria-labelledby={labelledBy ?? id}
            className={cx("glass scroll-pretty relative w-full max-h-[88dvh] overflow-y-auto overscroll-contain p-5 sm:p-7 !bg-white/95", wide ? "max-w-[820px]" : "max-w-[520px]")}
            initial={{ y: 40, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            {title && (
              <div className="flex items-start justify-between gap-3 mb-4">
                <h2 id={id} className="font-extrabold text-[length:var(--fs-h2)] text-ink leading-tight">{title}</h2>
                {dismissable && <IconButton icon={X} label="Đóng" onClick={onClose} className="!size-11 -mt-1 -mr-1 shrink-0" />}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  , document.body);
}

/* ---------------- Stat tile ---------------- */
export function Stat({ icon: Icon, label, value, tint = "#0284c7" }: { icon: LucideIcon; label: string; value: ReactNode; tint?: string }) {
  return (
    <div className="glass-soft flex max-sm:flex-col max-sm:items-start items-center gap-2 sm:gap-3 p-3 sm:p-4 min-w-0">
      <span className="grid place-items-center size-9 sm:size-11 rounded-2xl shrink-0" style={{ background: `${tint}1a`, color: tint }}>
        <Icon aria-hidden className="size-5" strokeWidth={2.4} />
      </span>
      <div className="min-w-0">
        <div className="text-[var(--fs-small)] text-ink-3 font-semibold leading-tight">{label}</div>
        <div className="font-extrabold text-ink text-[clamp(1.05rem,.95rem+.5vw,1.6rem)] leading-tight break-words">{value}</div>
      </div>
    </div>
  );
}

/* ---------------- Trophy (SVG) ---------------- */
export function Trophy({ className, glow = true }: { className?: string; glow?: boolean }) {
  const g = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${g}cup`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset=".45" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`${g}hl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${g}base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
        <radialGradient id={`${g}glow`} cx=".5" cy=".45" r=".55">
          <stop offset="0" stopColor="#fde68a" stopOpacity=".85" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow && <circle cx="100" cy="92" r="96" fill={`url(#${g}glow)`} />}
      {/* tay cầm */}
      <path d="M52 52 C18 52 18 108 64 112" fill="none" stroke={`url(#${g}cup)`} strokeWidth="11" strokeLinecap="round" />
      <path d="M148 52 C182 52 182 108 136 112" fill="none" stroke={`url(#${g}cup)`} strokeWidth="11" strokeLinecap="round" />
      {/* thân cúp */}
      <path d="M48 36 H152 V70 C152 112 128 136 100 140 C72 136 48 112 48 70 Z" fill={`url(#${g}cup)`} />
      <path d="M62 44 H76 V74 C76 100 86 118 96 126 C76 120 62 100 62 74 Z" fill="#fff" opacity=".35" />
      <ellipse cx="100" cy="36" rx="52" ry="8" fill="#fcd34d" />
      {/* ngôi sao */}
      <path d="M100 60 l8.2 16.6 18.3 2.7 -13.3 12.9 3.1 18.2 -16.3-8.6 -16.3 8.6 3.1-18.2 -13.3-12.9 18.3-2.7z" fill="#fff" opacity=".95" />
      {/* cổ + đế */}
      <rect x="90" y="138" width="20" height="22" rx="4" fill="#d97706" />
      <path d="M66 160 H134 L142 184 H58 Z" fill={`url(#${g}cup)`} />
      <rect x="48" y="184" width="104" height="22" rx="8" fill={`url(#${g}base)`} />
      <rect x="62" y="190" width="76" height="4" rx="2" fill="#bae6fd" opacity=".8" />
      <rect x="48" y="36" width="104" height="104" fill={`url(#${g}hl)`} opacity=".25" style={{ mixBlendMode: "overlay" }} />
    </svg>
  );
}

/* ---------------- Confetti ---------------- */
const CONFETTI_COLORS = ["#0284c7", "#10b981", "#f59e0b", "#38bdf8", "#34d399", "#fbbf24"];
export function Confetti({ run, pieces = 70 }: { run: boolean; pieces?: number }) {
  const reduce = useReducedMotion();
  const [seed] = useState(() =>
    Array.from({ length: pieces }, (_, i) => ({
      x: Math.random() * 100, delay: Math.random() * 0.5, rot: Math.random() * 720 - 360,
      drift: Math.random() * 40 - 20, dur: 2.4 + Math.random() * 1.6, size: 6 + Math.random() * 7,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length], round: Math.random() > 0.6,
    })),
  );
  if (!run || reduce) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {seed.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0 block"
          style={{ left: `${p.x}%`, width: p.size, height: p.round ? p.size : p.size * 0.45, background: p.color, borderRadius: p.round ? 99 : 2 }}
          initial={{ y: -30, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: p.drift * 4, rotate: p.rot, opacity: [1, 1, 0.8, 0] }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.25, 0.6, 0.4, 1] }}
        />
      ))}
    </div>
  );
}

/* ---------------- Status line (lưu/gửi) ---------------- */
export function Note({ tone = "sky", icon: Icon, children }: { tone?: "sky" | "amber" | "emerald"; icon: LucideIcon; children: ReactNode }) {
  const t = { sky: "bg-sky-50 text-deep border-sky-100", amber: "bg-amber-50 text-amber-900 border-amber-200", emerald: "bg-emerald-50 text-emerald-900 border-emerald-200" }[tone];
  return (
    <div className={cx("flex items-start gap-2.5 rounded-2xl border px-3.5 py-2.5 text-[var(--fs-small)] font-medium", t)}>
      <Icon aria-hidden className="size-[1.15em] mt-[.15em] shrink-0" strokeWidth={2.4} />
      <div>{children}</div>
    </div>
  );
}

/* ---------------- Thanh nút dính đáy ---------------- */
/**
 * Hàng nút hành động luôn thấy được ở đáy màn hình (trong tầm ngón cái) khi nội dung dài hơn màn hình;
 * nội dung ngắn thì nằm ngay dưới nội dung như bình thường (position: sticky, không che chữ cuối trang).
 * Đặt làm con TRỰC TIẾP của khối bao toàn màn (vd div gốc của màn hình), không đặt trong Card.
 */
export function StickyActions({ children, className, inner }: { children: ReactNode; className?: string; inner?: string }) {
  return (
    <div className={cx(
      "sticky bottom-0 z-30 mt-4 pointer-events-none pt-5 pb-[max(12px,env(safe-area-inset-bottom))]",
      "bg-gradient-to-t from-[#eefaff] via-[#eefaff]/90 to-transparent",
      className,
    )}>
      <div className={cx("pointer-events-auto flex items-center gap-2", inner)}>{children}</div>
    </div>
  );
}
