"use client";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/features/arena/components/ui";

/** Màu nhận diện 4 công nghệ (dùng xuyên suốt trang để học sinh dễ nhớ) */
export const TECH = {
  html: { name: "HTML", color: "#e34c26", soft: "#fff1ec", ink: "#9a2b12", role: "Khung nhà" },
  css: { name: "CSS", color: "#2965f1", soft: "#eef3ff", ink: "#1d3fa8", role: "Sơn & trang trí" },
  js: { name: "JavaScript", color: "#b88a00", soft: "#fff8db", ink: "#7a5b00", role: "Điện & nước" },
  db: { name: "Cơ sở dữ liệu", color: "#059669", soft: "#e8fbf3", ink: "#065f46", role: "Tủ hồ sơ" },
} as const;
export type TechKey = keyof typeof TECH;

/** Khối code có tô màu đơn giản theo từng dòng (không cần thư viện) */
export function CodeBlock({ code, lang, active, className }: { code: string; lang: "html" | "css" | "js" | "sql"; active?: number[]; className?: string }) {
  const lines = code.split("\n");
  return (
    <pre className={cx("rounded-2xl bg-slate-900 text-slate-100 text-[13px] sm:text-sm leading-relaxed p-3 sm:p-4 overflow-x-auto", className)} aria-label={`Đoạn code ${lang.toUpperCase()}`}>
      <code>
        {lines.map((ln, i) => (
          <span key={i} className={cx("block px-1 -mx-1 rounded transition-colors duration-300", active?.includes(i) && "bg-amber-400/25 ring-1 ring-amber-300/60")}>
            <span className="inline-block w-6 text-right mr-3 text-slate-500 select-none">{i + 1}</span>
            {highlight(ln, lang)}
          </span>
        ))}
      </code>
    </pre>
  );
}

/** Tô màu rất đơn giản: chú thích, chuỗi, thẻ HTML, từ khoá */
function highlight(line: string, lang: string): ReactNode {
  const comment = lang === "sql" ? line.indexOf("--") : lang === "html" ? line.indexOf("<!--") : line.indexOf("//");
  const body = comment >= 0 ? line.slice(0, comment) : line;
  const rest = comment >= 0 ? line.slice(comment) : "";
  const re = lang === "html"
    ? /(<\/?[a-zA-Z0-9]+|\/?>|"[^"]*")/g
    : lang === "css"
      ? /([.#]?[a-zA-Z-]+(?=\s*\{)|[a-z-]+(?=\s*:)|#[0-9a-fA-F]{3,6}|\d+(?:px|rem|%)?)/g
      : lang === "sql"
        ? /\b(SELECT|FROM|WHERE|AND|ORDER BY|LIMIT|INSERT|INTO|VALUES|UPDATE|SET|DESC|ASC)\b|('[^']*'|\d+)/g
        : /\b(let|const|function|if|else|return|true|false)\b|("[^"]*"|\d+)/g;
  const out: ReactNode[] = [];
  let last = 0, k = 0;
  for (const m of body.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push(body.slice(last, i));
    const t = m[0];
    const color = t.startsWith('"') || t.startsWith("'") ? "text-emerald-300"
      : /^\d/.test(t) || t.startsWith("#") ? "text-orange-300"
        : lang === "html" ? "text-sky-300"
          : lang === "css" ? (t.startsWith(".") || t.startsWith("#") ? "text-amber-300" : "text-sky-300")
            : "text-pink-300 font-bold";
    out.push(<span key={k++} className={color}>{t}</span>);
    last = i + t.length;
  }
  if (last < body.length) out.push(body.slice(last));
  if (rest) out.push(<span key="c" className="text-slate-400 italic">{rest}</span>);
  return out.length ? out : " ";
}

export function Section({ id, tech, icon: Icon, kicker, title, children }: {
  id: string; tech?: TechKey; icon: LucideIcon; kicker: string; title: string; children: ReactNode;
}) {
  const t = tech ? TECH[tech] : null;
  return (
    <section id={id} className="scroll-mt-28 pt-10 sm:pt-14">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center size-12 rounded-2xl text-white shrink-0" style={{ background: t?.color ?? "#0284c7" }}><Icon className="size-6" aria-hidden /></span>
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wider" style={{ color: t?.ink ?? "#0369a1" }}>{kicker}</p>
          <h2 className="font-black text-ink text-[length:var(--fs-h1)] leading-tight">{title}</h2>
        </div>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

/** Ô "Ghi nhớ" ngắn gọn cuối mỗi phần */
export function Remember({ tech, children }: { tech: TechKey; children: ReactNode }) {
  const t = TECH[tech];
  return (
    <div className="rounded-2xl border-2 p-4 sm:p-5" style={{ borderColor: t.color, background: t.soft }}>
      <p className="font-black" style={{ color: t.ink }}>📌 Ghi nhớ</p>
      <div className="mt-1 text-ink leading-relaxed">{children}</div>
    </div>
  );
}
