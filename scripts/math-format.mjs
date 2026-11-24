#!/usr/bin/env node
/**
 * Chuyển cách viết công thức dạng chữ (2^3, 2/3, √(x-1), x^2 − 5x + 6 = 0) sang LaTeX trong \( … \)
 * để hiển thị đúng kiểu sách giáo khoa (KaTeX). Chỉ áp dụng cho môn Toán và KHTN.
 *
 *   node scripts/math-format.mjs            → ghi src/db/seed/math-format.json + báo cáo docs/math-format-review.md
 *   node scripts/math-format.mjs --check    → chỉ in thống kê
 *
 * Không sửa file câu hỏi gốc: bảng chuyển đổi được áp vào DB lúc khởi động (src/db/migrate.ts),
 * và chỉ áp khi nội dung trong DB vẫn đúng y như bản gốc (giáo viên đã sửa tay thì giữ nguyên).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUBJECTS = new Set(["Toán", "KHTN"]);

/* ------------------------------------------------------------------ */
/* 1. Đơn vị đo: viết thẳng, mũ dùng ký tự ² ³ (không đưa vào công thức) */
const SUP = { 2: "²", 3: "³" };
const UNIT = /^(?:cm|dm|mm|km|m|kg|g|N|Pa|J|W|kJ|kWh|L|mL|mol|amu|Ω|V|A|h|s|ha)(?:\^([23]))?(?:\/(?:m|cm|dm|h|s|mol|L)(?:\^([23]))?)?$/;
const unitText = (tok) => tok.replace(/\^([23])/g, (_, d) => SUP[d]);

/* 2. Phân loại token (tách theo khoảng trắng) */
const OPS = new Set(["+", "-", "−", "=", "<", ">", "≤", "≥", "≠", "±", "×", "÷", "·", ".", ":", "⇒", "⇔", "→", "≈", "∈", "∉", "|", "...", "…"]);
const MATH_CHARS = /^[0-9A-Za-zđπΔ'′\^√∛()\[\]|+\-−=×÷·.,:;/<>≤≥≠±%°²³!∈∉{}₀-₉_]+$/;
const FUNCS = new Set(["sin", "cos", "tan", "cot"]);
const NUM = /^\(?-?[0-9]+(?:[,.][0-9]+)?\)?$/;

function isMathToken(tok, subject) {
  if (!MATH_CHARS.test(tok)) return false;                       // có chữ tiếng Việt có dấu → không phải công thức
  if (/[A-Z][a-z]?[₀-₉]/.test(tok)) return false;                 // công thức hoá học (O₂, C₂H₅OH): để nguyên
  if (/(^|[^A-Z])đ/.test(tok.replace(/_[a-zđ]+/g, ""))) return false;                        // "tđ" đứng riêng là chữ, không phải biến
  const words = tok.replace(/_[a-zđ]+/g, "").replace(/đ/g, "d").match(/[A-Za-z]+/g) ?? [];
  if (words.some((w) => w.length > 3 && !FUNCS.has(w))) return false;
  // từ tiếng Việt viết không dấu, ký hiệu hoá–sinh, số La Mã: không phải biến
  if (words.some((w) => /^(cho|khi|thi|va|la|co|con|hay|neu|the|and|or|of|cm|mm|dm|km|kg|mol|ra|suy|sai|ta|cao|chu|vi|ghi|bi|dd|aa|ph|xiv|iv|vi|ix|xi|xii|xiii|xv)$/i.test(w))) return false;
  if (subject === "KHTN") {
    if (/[A-Z][a-z]/.test(tok)) return false;                      // ký hiệu nguyên tố: Mg, Al, Ca…
    if (/[A-Z]\d*[A-Z]|[A-Z]\d[A-Z]?/.test(tok) && (tok.match(/[A-Z]/g) ?? []).length >= 2) return false; // H2O, CO2
    if (/^tan$/i.test(tok)) return false;                            // "hoà tan"
    if (words.some((w) => w.length >= 2 && w === w.toUpperCase())) return false; // viết tắt: NST, ADN
  }
  return /[0-9A-Za-zπΔ√∛]/.test(tok);
}
/** có dấu hiệu "toán" thực sự (không chỉ là một con số trơn) */
const SIGNAL = /[\^√∛/=<>≤≥≠±×÷·∈]|[0-9][a-zA-Z]|^[a-zA-Z]$|[a-zA-Z]\(|\d\s*[.:]\s*[\d(]|[\d)a-zA-Z]\s*[-−+]\s*[\d(a-zA-Z]|^[a-zA-Z][₀-₉]/;

/* 3. Chuyển một cụm công thức sang LaTeX */
function matchParen(s, i) {             // s[i] là ( hoặc [ → vị trí dấu đóng tương ứng
  const open = s[i], close = open === "(" ? ")" : "]";
  let d = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === open) d++;
    else if (s[j] === close && --d === 0) return j;
  }
  return -1;
}
function readExp(s, i) {                // số mũ: (…) | số | một chữ cái
  if (s[i] === "(") { const j = matchParen(s, i); return j < 0 ? null : [s.slice(i, j + 1), j + 1]; }
  const m = /^(?:-?[0-9]+|[A-Za-z])/.exec(s.slice(i));
  return m ? [m[0], i + m[0].length] : null;
}
function readAtom(s, i) {               // một "toán hạng" bắt đầu tại i → [chuỗi, vị trí kế tiếp]
  let k;
  if (s[i] === "(" || s[i] === "[") {
    const j = matchParen(s, i);
    if (j < 0) return null;
    k = j + 1;
  } else if (s[i] === "√" || s[i] === "∛") {
    const a = readAtom(s, i + 1);
    if (!a) return null;
    k = a[1];
  } else {
    const m = /^(?:[0-9]+(?:,[0-9]+)?)?(?:[A-Za-zπΔđ](?:_[0-9a-zđ]+)?)*'?/.exec(s.slice(i));
    if (!m || !m[0]) return null;
    k = i + m[0].length;
  }
  while (s[k] === "^") { const e = readExp(s, k + 1); if (!e) break; k = e[1]; }
  // nhân liền không cách: 2√3, √x(√x − 1), a(b+c)
  if (s[k] === "(" || s[k] === "√") { const n = readAtom(s, k); if (n) k = n[1]; }
  return [s.slice(i, k), k];
}
const strip = (x) => (/^\(.*\)$/.test(x) && matchParen(x, 0) === x.length - 1 ? x.slice(1, -1) : x);

function toTex(src) {
  let s = src.replace(/−/g, "-").replace(/\s+/g, " ").trim()
    .replace(/\{/g, "\\{").replace(/\}/g, "\\}")
    .replace(/([a-z])([₀-₉])/g, (_, a, d) => `${a}_${"₀₁₂₃₄₅₆₇₈₉".indexOf(d)}`);
  // phân số: toán hạng / toán hạng; tử số kéo dài qua các phép nhân viết liền bằng dấu chấm (π.6.60/180)
  for (let guard = 0; guard < 30 && s.includes("/"); guard++) {
    const i = s.indexOf("/");
    let L = null;
    for (let st = 0; st < i; st++) {
      if (st > 0 && /[0-9A-Za-zπ_^]/.test(s[st - 1]) && /[0-9A-Za-zπ]/.test(s[st])) continue; // không bắt đầu giữa chừng một số/biến
      const a = readAtom(s, st);
      if (a && a[1] === i) { L = [st, a[0]]; break; }
    }
    if (L) {   // nối thêm các thừa số phía trước dạng a.b.c (không có khoảng trắng)
      let st = L[0];
      while (st > 1 && (s[st - 1] === "." || s[st - 1] === "·")) {
        let found = null;
        for (let b = 0; b < st - 1; b++) { const a = readAtom(s, b); if (a && a[1] === st - 1 && (b === 0 || !/[0-9A-Za-zπ]/.test(s[b - 1]))) { found = b; break; } }
        if (found === null) break;
        st = found;
      }
      L = [st, s.slice(st, i)];
    }
    const R = readAtom(s, i + 1);
    if (!L || !R) { s = s.slice(0, i) + "\u2215" + s.slice(i + 1); continue; } // không chắc → giữ dấu chéo
    s = s.slice(0, L[0]) + `\\frac{${strip(L[1])}}{${strip(R[0])}}` + s.slice(R[1]);
  }
  s = s.replace(/\u2215/g, "/");
  // căn
  for (let guard = 0; guard < 30 && /[√∛]/.test(s); guard++) {
    const i = s.search(/[√∛]/);
    const deg = s[i] === "∛" ? "[3]" : "";
    let a = null;
    if (s[i + 1] === "(" || s[i + 1] === "[") { const j = matchParen(s, i + 1); if (j > 0) a = [s.slice(i + 1, j + 1), j + 1]; }
    else { const m = /^(?:[0-9]+(?:,[0-9]+)?|[A-Za-z])/.exec(s.slice(i + 1)); if (m) a = [m[0], i + 1 + m[0].length]; }
    if (!a) { s = s.slice(0, i) + `\\sqrt${deg}{\\phantom{x}}` + s.slice(i + 1); continue; }
    s = s.slice(0, i) + `\\sqrt${deg}{${strip(a[0])}}` + s.slice(a[1]);
  }
  // chỉ số bằng chữ (R_tđ) — đánh dấu, đổi sang \text ở cuối
  s = s.replace(/_([a-zđ]{2,})/g, "_\u0000$1\u0001");
  // mũ: ^(…) | ^số | ^chữ
  s = s.replace(/\^\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, "^{$1}").replace(/\^(-?[0-9]+|[A-Za-z])/g, "^{$1}");
  // ký hiệu
  s = s
    .replace(/(\d) (\d{3})(?!\d)/g, "$1\\,$2").replace(/(\d) (\d{3})(?!\d)/g, "$1\\,$2")
    .replace(/(\d),(\d)/g, "$1{,}$2")
    .replace(/(?<=[\d)a-zA-Zπ}]) ?\. ?(?=[\d(a-zA-Zπ\\√])/g, " \\cdot ")
    .replace(/×/g, "\\times ").replace(/÷/g, "\\div ").replace(/·/g, "\\cdot ")
    .replace(/≤/g, "\\le ").replace(/≥/g, "\\ge ").replace(/≠/g, "\\ne ").replace(/±/g, "\\pm ")
    .replace(/⇒/g, "\\Rightarrow ").replace(/⇔/g, "\\Leftrightarrow ").replace(/→/g, "\\to ").replace(/≈/g, "\\approx ")
    .replace(/∉/g, "\\notin ").replace(/∈ ?([NZQR])(?![A-Za-z])/g, "\\in \\mathbb{$1}").replace(/∈/g, "\\in ")
    .replace(/…|\.\.\./g, "\\ldots ")
    .replace(/π/g, "\\pi ").replace(/Δ/g, "\\Delta ").replace(/%/g, "\\%").replace(/(^|[^0-9A-Za-z)])°([CF])(?![A-Za-z])/g, "$1{}^{\\circ}\\mathrm{$2}").replace(/°([CF])(?![A-Za-z])/g, "^{\\circ}\\mathrm{$1}").replace(/°/g, "^\\circ")
    .replace(/²/g, "^2").replace(/³/g, "^3")
    .replace(/\u0000([a-zđ]+)\u0001/g, "{\\text{$1}}").replace(/(?<!\\text\{[a-z]*)đ/g, "\\text{đ}")
    .replace(/\b(sin|cos|tan|cot)\b/g, "\\$1 ");
  return s.replace(/\s+/g, " ").replace(/\{ /g, "{").replace(/ \}/g, "}").trim();
}

/* 4. Tìm các cụm công thức trong một câu tiếng Việt */
export function formatMath(text, subject = "Toán") {
  if (!text || text.includes("\\(")) return { text, changed: false, runs: [] };
  // "R tđ" (điện trở tương đương) → R với chỉ số "tđ"
  const parts = text.replace(/(^|[^\p{L}])([A-Z]) tđ(?![\p{L}])/gu, "$1$2_tđ").split(/(\s+)/);
  const roman = /(^|[\s(])[IVXLCDM]{2,}(?=[\s.,;)]|$)/.test(text);   // có số La Mã → chữ I, V, X… viết thẳng
  // câu hoá học (có Ca, Mg, H₂O…): chữ hoa đứng riêng như C, O là nguyên tố, không phải biến
  const chem = subject === "KHTN" && /(^|[^A-Za-z])(Ca|Mg|Na|Al|Fe|Cu|Zn|Cl|Ba|Ag|Pb|K|[A-Z][a-z]?[0-9₀-₉])(?![a-z])/.test(text);
  const out = [];
  const runs = [];
  let run = [];          // các phần (token toán + khoảng trắng) đang gom
  let prevNumber = false;
  const flush = () => {
    let core = run.join("");
    run = [];
    let head = "", tail = "";
    // bỏ khoảng trắng / toán tử ở hai đầu cụm
    for (;;) {
      const m = /^(\s+|(?:\.\.\.|…|[+\-−=<>≤≥≠±×÷·.:⇒⇔→≈∈∉|])(?=\s|$))/.exec(core);
      if (!m) break; head += m[0]; core = core.slice(m[0].length);
    }
    for (;;) {
      const m = /(\s+|(?<=\s|^)(?:\.\.\.|…|[+\-−=<>≤≥≠±×÷·.:⇒⇔→≈∈∉|]))$/.exec(core);
      if (!m || !core) break; tail = m[0] + tail; core = core.slice(0, -m[0].length);
    }
    // ngoặc thừa ở hai đầu (vd "(d = 10 000" … "N/m³)") đưa ra ngoài công thức
    const cnt = (c) => core.split(c).length - 1;
    while (core.startsWith("(") && cnt("(") > cnt(")")) { head += "("; core = core.slice(1); }
    while (core.endsWith(")") && cnt(")") > cnt("(")) { tail = ")" + tail; core = core.slice(0, -1); }
    const balanced = cnt("(") === cnt(")") && cnt("{") === cnt("}") && cnt("[") === cnt("]");
    const lone = /^[A-Za-z]$/.test(core.trim());
    const onlyElements = chem && !/[a-z]/.test(core.replace(/\s/g, "")) && /[A-Z]/.test(core);
    const isMath = core && balanced && SIGNAL.test(core) && !NUM.test(core.trim()) && !(lone && (subject === "KHTN" || roman)) && !onlyElements;
    if (isMath) {
      let tex = toTex(core);
      if (subject === "Toán") tex = tex.replace(/(?<![\\A-Za-z])([a-z])([2-4])(?![0-9{])/g, "$1^{$2}").replace(/\)([2-4])(?![0-9])/g, ")^{$1}"); // dữ liệu cũ mất chỉ số trên: x2 → x²
      if (subject === "KHTN") tex = tex.replace(/(?<![\\A-Za-z])([A-Z])([0-9])(?![0-9])/g, "$1_{$2}");        // R1 → R₁
      if (roman) tex = tex.replace(/(?<![\\A-Za-z])([IVXLCDM]+)(?![A-Za-z])/g, "\\mathrm{$1}");
      runs.push([core, tex]); out.push(head + `\\(${tex}\\)` + tail);
    }
    else out.push(head + core + tail);
  };
  for (const p of parts) {
    if (/^\s+$/.test(p)) { if (run.length) run.push(p); else out.push(p); continue; }
    if (OPS.has(p)) { prevNumber = false; if (run.length) run.push(p); else out.push(p); continue; }
    // dấu câu cuối token (không tính ngoặc — ngoặc thuộc công thức)
    const m = /^(.*?)([.,?;:!]*)$/.exec(p);
    const core = m[1], trail = m[2];
    const bare = core.replace(/^\(|\)$/g, "");
    if (/^[0-9]+(?:[,.][0-9]+)?(?:cm|dm|mm|km|m|kg|g|N|Pa|J|W|L|mL|mol|h|s|ha)(?:\^[23])?$/.test(bare)) {
      if (run.length) flush();
      out.push(unitText(core) + trail);
      prevNumber = false;
      continue;
    }
    // đơn vị một chữ cái (m, g, N, V…) chỉ khi đứng ngay sau một con số — nếu không thì là biến
    const isUnit = UNIT.test(bare) && (bare.includes("/") || bare.replace(/\^.*$/, "").length > 1 || prevNumber);
    if (isUnit) {
      if (run.length) flush();
      out.push(unitText(core) + trail);
      prevNumber = false;
      continue;
    }
    if (core && isMathToken(core, subject)) {
      run.push(core);
      prevNumber = NUM.test(core);
      if (trail) { flush(); out.push(trail); }
    } else {
      if (run.length) flush();
      out.push(p);
      prevNumber = false;
    }
  }
  if (run.length) flush();
  const result = out.join("");
  return { text: result, changed: result !== text, runs };
}

/* ------------------------------------------------------------------ */
function load() {
  const base = JSON.parse(readFileSync(join(ROOT, "src/db/seed/questions.json"), "utf8"));
  const draft = JSON.parse(readFileSync(join(ROOT, "src/db/seed/explanations.draft.json"), "utf8"));
  const bank = [6, 7, 8, 9].flatMap((g) => JSON.parse(readFileSync(join(ROOT, `src/db/seed/bank/grade-${g}.json`), "utf8")));
  return [...base.map((q) => ({ ...q, explanation: q.explanation ?? draft[q.code]?.explain ?? null })), ...bank];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const qs = load().filter((q) => SUBJECTS.has(q.subject));
  const entries = [];
  const report = [];
  for (const q of qs) {
    const fields = [["content", q.content], ...q.options.map((o, i) => [`options.${i}`, o]), ["explanation", q.explanation]];
    for (const [field, from] of fields) {
      if (!from) continue;
      const r = formatMath(from, q.subject);
      if (!r.changed) continue;
      entries.push({ code: q.code, field, from, to: r.text });
      report.push(`| ${q.code} | ${field} | ${from.replace(/\|/g, "\\|")} | ${r.text.replace(/\|/g, "\\|")} |`);
    }
  }
  console.log(`Toán + KHTN: ${qs.length} câu · ${entries.length} trường được chuyển`);
  if (!process.argv.includes("--check")) {
    writeFileSync(join(ROOT, "src/db/seed/math-format.json"), JSON.stringify(entries, null, 1) + "\n");
    writeFileSync(join(ROOT, "docs/math-format-review.md"),
      `# Chuyển công thức sang LaTeX — danh sách để thầy cô rà soát\n\nSinh bởi \`node scripts/math-format.mjs\`. ${entries.length} trường (Toán, KHTN). Cột phải là nội dung mới, công thức nằm trong \\\\( … \\\\).\n\n| Mã | Trường | Trước | Sau |\n|---|---|---|---|\n${report.join("\n")}\n`);
    console.log("Đã ghi src/db/seed/math-format.json và docs/math-format-review.md");
  }
}
