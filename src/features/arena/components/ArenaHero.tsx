import { motion, useReducedMotion } from "motion/react";
import { Atom, BookOpenText, Calculator, Languages } from "lucide-react";
import { Trophy } from "./ui";

/**
 * Đấu trường 3D giả lập bằng CSS 3D + SVG (không dùng WebGL):
 * khán đài vòng cung, đèn rọi, sàn tròn phát sáng nghiêng 68°,
 * bục vinh quang hình trụ và cúp vàng lơ lửng.
 */
export function ArenaHero({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full select-none" style={{ aspectRatio: compact ? "1 / .78" : "1 / .9" }} aria-hidden>
      {/* ---- Khán đài ---- */}
      <svg viewBox="0 0 600 540" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="stand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
            <stop offset="1" stopColor="#bae6fd" stopOpacity=".7" />
          </linearGradient>
          <linearGradient id="stand2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0f2fe" stopOpacity=".95" />
            <stop offset="1" stopColor="#a5f3fc" stopOpacity=".55" />
          </linearGradient>
          <radialGradient id="sky" cx=".5" cy=".55" r=".6">
            <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <stop offset=".6" stopColor="#e0f7ff" stopOpacity=".6" />
            <stop offset="1" stopColor="#e0f7ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="300" rx="300" ry="240" fill="url(#sky)" />
        {/* các tầng khán đài: nửa trên của elip đồng tâm */}
        {[
          { rx: 296, ry: 178, fill: "url(#stand)" },
          { rx: 262, ry: 150, fill: "url(#stand2)" },
          { rx: 228, ry: 124, fill: "url(#stand)" },
        ].map((t, i) => (
          <path key={i}
            d={`M ${300 - t.rx} 330 A ${t.rx} ${t.ry} 0 0 1 ${300 + t.rx} 330 L ${300 + t.rx - 30} 330 A ${t.rx - 30} ${t.ry - 24} 0 0 0 ${300 - t.rx + 30} 330 Z`}
            fill={t.fill} stroke="#7dd3fc" strokeOpacity=".55" strokeWidth="1.5" />
        ))}
        {/* đèn khán đài */}
        {Array.from({ length: 30 }, (_, i) => {
          const a = Math.PI + (i / 29) * Math.PI;
          const x = +(300 + Math.cos(a) * 280).toFixed(2), y = +(330 + Math.sin(a) * 166).toFixed(2); // làm tròn để HTML server/client khớp nhau
          return <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3.2 : 2} fill={i % 5 === 0 ? "#fbbf24" : "#38bdf8"} opacity={i % 2 ? 0.9 : 0.6} />;
        })}
        {Array.from({ length: 22 }, (_, i) => {
          const a = Math.PI + (i / 21) * Math.PI;
          const x = +(300 + Math.cos(a) * 214).toFixed(2), y = +(330 + Math.sin(a) * 112).toFixed(2);
          return <circle key={`b${i}`} cx={x} cy={y} r="2" fill="#10b981" opacity=".55" />;
        })}
        {/* cột đèn hai bên */}
        {[52, 548].map((x) => (
          <g key={x}>
            <rect x={x - 4} y="120" width="8" height="200" rx="4" fill="#bae6fd" />
            <rect x={x - 18} y="108" width="36" height="16" rx="6" fill="#0284c7" />
            <circle cx={x - 8} cy="116" r="3" fill="#fef3c7" /><circle cx={x + 8} cy="116" r="3" fill="#fef3c7" />
          </g>
        ))}
      </svg>

      {/* ---- Đèn rọi ---- */}
      <div className="beam absolute left-[6%] top-[19%] w-[46%] h-[70%] origin-top-left rotate-[-16deg] blur-[6px]"
        style={{ clipPath: "polygon(0 0, 14% 0, 100% 100%, 46% 100%)", background: "linear-gradient(180deg, rgba(254,243,199,.9), rgba(255,255,255,0))" }} />
      <div className="beam absolute right-[6%] top-[19%] w-[46%] h-[70%] origin-top-right rotate-[16deg] blur-[6px]"
        style={{ clipPath: "polygon(86% 0, 100% 0, 54% 100%, 0 100%)", background: "linear-gradient(180deg, rgba(186,230,253,.95), rgba(255,255,255,0))", animationDelay: "-3s" }} />

      {/* ---- Sàn đấu tròn nghiêng ---- */}
      <div className="arena-stage absolute inset-x-0 top-[74%] h-0 flex justify-center">
        <div className="arena-floor relative w-[94%] aspect-square -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(224,242,254,.9) 35%, rgba(186,230,253,.55) 60%, rgba(186,230,253,0) 72%)" }}>
          <div className="absolute inset-[8%] rounded-full border-[3px] border-sky-300/70" />
          <div className="absolute inset-[16%] rounded-full border-2 border-dashed border-sky-400/70 ring-spin" />
          <div className="absolute inset-[24%] rounded-full border-[3px] border-emerald-300/70 ring-spin-rev" style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }} />
          <div className="absolute inset-[30%] rounded-full"
            style={{ background: "repeating-conic-gradient(from 0deg, rgba(2,132,199,.10) 0deg 6deg, transparent 6deg 15deg)" }} />
          <div className="absolute inset-[36%] rounded-full shadow-[0_0_60px_20px_rgba(56,189,248,.45)] bg-sky-100/60" />
          {!reduce && <div className="absolute inset-[30%] rounded-full border-4 border-sky-300/70 pulse-ring" />}
        </div>
      </div>

      {/* ---- Bục vinh quang + cúp ---- */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[16%] w-[40%] flex flex-col items-center">
        <motion.div
          className="relative z-10 w-[84%] trophy-float"
          initial={reduce ? false : { y: 40, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.15 }}
        >
          <div className="absolute inset-[-25%] rounded-full bg-[radial-gradient(circle,rgba(253,230,138,.75),transparent_62%)]" />
          <Trophy className="relative w-full drop-shadow-[0_18px_22px_rgba(180,83,9,.35)]" glow={false} />
        </motion.div>
        {/* mặt bục */}
        <div className="relative z-0 w-full aspect-[4/1] -mt-[7%] rounded-[50%]"
          style={{ background: "radial-gradient(ellipse at 50% 40%, #ffffff, #e0f2fe 60%, #7dd3fc)", boxShadow: "0 0 0 3px rgba(125,211,252,.9), 0 0 34px 6px rgba(56,189,248,.55)" }} />
        {/* thân bục */}
        <div className="relative -z-10 w-full aspect-[4/1.05] -mt-[12.5%]"
          style={{ borderRadius: "0 0 50% 50% / 0 0 48% 48%", background: "linear-gradient(90deg,#0369a1 0%,#0ea5e9 30%,#7dd3fc 50%,#0ea5e9 70%,#0369a1 100%)" }}>
          <div className="absolute inset-x-0 top-[58%] h-[8%] bg-amber-300/90 blur-[1px]" style={{ borderRadius: "0 0 50% 50% / 0 0 100% 100%" }} />
        </div>
      </div>

      {/* ---- Chip môn học lơ lửng ---- */}
      {[
        { Icon: Calculator, label: "Toán", cls: "left-[4%] top-[42%]", color: "#0284c7", d: 0 },
        { Icon: Atom, label: "KHTN", cls: "right-[3%] top-[36%]", color: "#059669", d: 1.2 },
        { Icon: Languages, label: "Tiếng Anh", cls: "left-[10%] top-[70%]", color: "#d97706", d: 2.1 },
        { Icon: BookOpenText, label: "Ngữ văn", cls: "right-[8%] top-[66%]", color: "#db2777", d: 0.6 },
      ].map(({ Icon, label, cls, color, d }) => (
        <motion.div key={label}
          className={`absolute ${cls} glass !rounded-2xl px-2.5 py-1.5 flex items-center gap-1.5 text-[clamp(.62rem,.55rem+.35vw,.95rem)] font-bold text-ink ${compact ? "hidden sm:flex" : ""}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -8, 0] }}
          transition={reduce ? {} : { opacity: { delay: 0.5 + d * 0.2 }, y: { duration: 5 + d, repeat: Infinity, ease: "easeInOut", delay: d } }}
        >
          <span className="grid place-items-center size-[1.9em] rounded-xl" style={{ background: `${color}1f`, color }}>
            <Icon className="size-[1.1em]" strokeWidth={2.5} />
          </span>
          {label}
        </motion.div>
      ))}
    </div>
  );
}
