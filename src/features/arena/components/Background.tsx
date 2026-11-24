import { once, useIsClient } from "../lib/client";

/** Nền trời sáng: đốm sáng radial + hạt trôi nhẹ. Cố định, không chặn tương tác. */
export function Background() {
  // Hạt ngẫu nhiên chỉ sinh ở trình duyệt để HTML render ở server và client giống nhau
  const isClient = useIsClient();
  const particles = !isClient ? [] : once("particles", () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: Math.random() * 100,
        size: 3 + Math.random() * 6,
        dur: 14 + Math.random() * 18,
        delay: -Math.random() * 30,
        dx: `${Math.random() * 80 - 40}px`,
        color: ["rgba(2,132,199,.35)", "rgba(16,185,129,.35)", "rgba(217,119,6,.32)", "rgba(255,255,255,.95)"][i % 4],
      })),
  );
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: "linear-gradient(160deg, #e0f7ff 0%, #f0fdf4 52%, #e0f2fe 100%)" }}>
      <div className="bg-orb" style={{ width: "46vmax", height: "46vmax", left: "-12vmax", top: "-14vmax", background: "radial-gradient(circle, #7dd3fc, transparent 70%)" }} />
      <div className="bg-orb" style={{ width: "34vmax", height: "34vmax", right: "-10vmax", top: "8vh", background: "radial-gradient(circle, #fde68a, transparent 70%)", opacity: 0.45 }} />
      <div className="bg-orb" style={{ width: "42vmax", height: "42vmax", left: "20vw", bottom: "-22vmax", background: "radial-gradient(circle, #6ee7b7, transparent 70%)", opacity: 0.45 }} />
      {/* lưới mờ gợi không gian công nghệ */}
      <div className="absolute inset-0 opacity-[.35]" style={{
        backgroundImage: "linear-gradient(rgba(2,132,199,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(2,132,199,.07) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse at 50% 0%, #000 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 0%, transparent 70%)",
      }} />
      {particles.map((p, i) => (
        <span key={i} className="particle" style={{
          left: `${p.left}%`, width: p.size, height: p.size, background: p.color,
          animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, ["--dx" as string]: p.dx,
          boxShadow: p.color.includes("255") ? "0 0 8px rgba(125,211,252,.9)" : undefined,
        }} />
      ))}
    </div>
  );
}
