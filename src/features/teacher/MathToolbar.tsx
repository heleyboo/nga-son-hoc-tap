"use client";
import type { RefObject } from "react";

/** Ô đang soạn (để chèn công thức đúng chỗ con trỏ) */
export type FieldTarget = { el: HTMLInputElement | HTMLTextAreaElement; set: (v: string) => void } | null;

type Snip = { label: string; title: string; build?: (sel: string) => string; raw?: string; block?: string };
const SNIPS: Snip[] = [
  { label: "a/b", title: "Phân số", build: (s) => `\\frac{${s || "a"}}{b}` },
  { label: "√x", title: "Căn bậc hai", build: (s) => `\\sqrt{${s || "x"}}` },
  { label: "∛x", title: "Căn bậc ba", build: (s) => `\\sqrt[3]{${s || "x"}}` },
  { label: "xⁿ", title: "Số mũ", build: (s) => `${s || "x"}^{2}` },
  { label: "x₁", title: "Chỉ số dưới", build: (s) => `${s || "x"}_{1}` },
  { label: "{ hệ", title: "Hệ phương trình (dòng riêng)", block: "\\[ \\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases} \\]" },
  { label: "( công thức )", title: "Ô công thức trống — gõ LaTeX bên trong", build: (s) => s || " " },
  ...["≤", "≥", "≠", "±", "×", "÷", "π", "°", "∈", "⇒"].map((c) => ({ label: c, title: `Chèn ${c}`, raw: c })),
];

/** Con trỏ đang nằm trong một công thức \( … \) chưa đóng? */
function insideMath(text: string, pos: number) {
  const before = text.slice(0, pos);
  return before.split("\\(").length - 1 > before.split("\\)").length - 1;
}

/** Hàng nút chèn công thức: giáo viên không cần biết LaTeX */
export function MathToolbar({ target, fallback }: { target: RefObject<FieldTarget>; fallback: () => FieldTarget }) {
  const insert = (s: Snip) => {
    const t = target.current ?? fallback();
    if (!t) return;
    const { el, set } = t;
    const v = el.value, a = el.selectionStart ?? v.length, b = el.selectionEnd ?? v.length;
    const sel = v.slice(a, b);
    let piece: string;
    if (s.raw) piece = s.raw;
    else if (s.block) piece = s.block;
    else {
      const core = s.build!(sel);
      piece = insideMath(v, a) ? core : `\\( ${core} \\)`;
    }
    const next = v.slice(0, a) + piece + v.slice(b);
    set(next);
    requestAnimationFrame(() => { el.focus(); const p = a + piece.length; el.setSelectionRange(p, p); });
  };
  return (
    <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Chèn công thức">
      {SNIPS.map((s) => (
        <button key={s.label} type="button" title={s.title} aria-label={s.title}
          onMouseDown={(e) => e.preventDefault() /* giữ con trỏ ở ô đang gõ */} onClick={() => insert(s)}
          className="min-h-9 min-w-9 px-2 rounded-lg bg-white border border-sky-100 text-deep font-bold text-sm hover:bg-sky-50 hover:border-sky-300 cursor-pointer">
          {s.label}
        </button>
      ))}
    </div>
  );
}
