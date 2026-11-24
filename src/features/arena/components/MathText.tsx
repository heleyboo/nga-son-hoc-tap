import katex from "katex";
import { Fragment, useMemo } from "react";

/**
 * Hiển thị câu hỏi có công thức.
 *   \( … \)  công thức LaTeX trong dòng   vd: Tính \( \frac{2}{3} + \sqrt{16} \)
 *   \[ … \]  công thức riêng một dòng (căn giữa), vd hệ phương trình
 * Không dùng $…$ vì kho câu hỏi Tin học có địa chỉ ô Excel như $B$1.
 * Phần chữ thường vẫn hỗ trợ cách viết cũ: x^2 → x², 2^(n+3) → mũ (n+3).
 * KaTeX vẽ bằng HTML/CSS (không cần mạng ngoài), kèm MathML cho trình đọc màn hình.
 */
const POW = /\^(\([^()]{1,24}\)|[A-Za-z0-9₀-₉]{1,6})/g;
const MATH = /\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;

type Part = { t: "text"; v: string } | { t: "math"; html: string; display: boolean };

const cache = new Map<string, string>();
function renderTex(tex: string, display: boolean) {
  const k = (display ? "D" : "I") + tex;
  let html = cache.get(k);
  if (html === undefined) {
    html = katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore", trust: false, output: "htmlAndMathml" });
    if (cache.size > 2000) cache.clear();
    cache.set(k, html);
  }
  return html;
}

function split(text: string): Part[] {
  if (!text.includes("\\(") && !text.includes("\\[")) return [{ t: "text", v: text }];
  const parts: Part[] = [];
  let last = 0;
  for (const m of text.matchAll(MATH)) {
    const i = m.index ?? 0;
    if (i > last) parts.push({ t: "text", v: text.slice(last, i) });
    const display = m[2] !== undefined;
    parts.push({ t: "math", html: renderTex((m[1] ?? m[2]).trim(), display), display });
    last = i + m[0].length;
  }
  if (last < text.length) parts.push({ t: "text", v: text.slice(last) });
  // cả đoạn chỉ là một công thức (thường là một đáp án như 11/28): vẽ cỡ đầy đủ như trong đề thi
  if (parts.length === 1 && parts[0].t === "math" && !parts[0].display) {
    const m = /^\s*\\\(([\s\S]+?)\\\)\s*$/.exec(text);
    if (m) parts[0] = { t: "math", html: renderTex(`\\displaystyle ${m[1].trim()}`, false), display: false };
  }
  return parts;
}

/** Chữ thường: chỉ đổi cách viết mũ kiểu cũ (x^2) thành chữ nhỏ phía trên */
function PlainText({ text }: { text: string }) {
  const out: (string | { sup: string })[] = [];
  let last = 0;
  for (const m of text.matchAll(POW)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    let sup = m[1];
    if (sup.startsWith("(") && sup.endsWith(")")) sup = sup.slice(1, -1);
    out.push({ sup });
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return (
    <>
      {out.map((p, i) =>
        typeof p === "string" ? <Fragment key={i}>{p}</Fragment> : <sup key={i} className="text-[.68em] font-bold leading-none ml-[.04em]">{p.sup}</sup>,
      )}
    </>
  );
}

export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => split(text), [text]);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.t === "text" ? <PlainText key={i} text={p.v} />
          : <span key={i} className={p.display ? "math-display" : "math-inline"} dangerouslySetInnerHTML={{ __html: p.html }} />,
      )}
    </span>
  );
}

/** Bỏ ký hiệu công thức để dùng ở chỗ chỉ hiện chữ thuần (tiêu đề, ảnh chia sẻ, CSV) */
export function plainMath(text: string) {
  return text
    .replace(MATH, (_, a: string | undefined, b: string | undefined) => (a ?? b ?? "")
      .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
      .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
      .replace(/\\(times)/g, "×").replace(/\\(div)/g, "÷").replace(/\\(cdot)/g, "·")
      .replace(/\\le(q)?/g, "≤").replace(/\\ge(q)?/g, "≥").replace(/\\ne(q)?/g, "≠").replace(/\\pi/g, "π")
      .replace(/\{,\}/g, ",").replace(/[{}]/g, "").replace(/\\[a-zA-Z]+/g, "").trim());
}
