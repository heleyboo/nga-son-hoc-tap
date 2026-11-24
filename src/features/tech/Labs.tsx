"use client";
import { Play, RotateCcw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { cx } from "@/features/arena/components/ui";
import { sfx } from "@/lib/sfx";
import { CodeBlock, TECH } from "./shared";

/* =============================== HTML =============================== */
const HTML_START = `<h1>Lớp 7A của em</h1>
<p>Lớp em có <b>40</b> bạn, rất <i>chăm chỉ</i>.</p>
<h2>Môn học em thích</h2>
<ul>
  <li>Toán</li>
  <li>Tin học</li>
  <li>Khoa học tự nhiên</li>
</ul>
<button>Bấm thử</button>`;

const TAGS: [string, string][] = [
  ["<h1> … </h1>", "Tiêu đề lớn nhất (có h1 → h6, số càng to chữ càng nhỏ)"],
  ["<p> … </p>", "Một đoạn văn"],
  ["<b> … </b>", "Chữ đậm"],
  ["<i> … </i>", "Chữ nghiêng"],
  ["<ul> <li> … </li> </ul>", "Danh sách gạch đầu dòng"],
  ["<button> … </button>", "Nút bấm"],
  ["<img src=\"…\">", "Hình ảnh"],
  ["<a href=\"…\"> … </a>", "Đường liên kết sang trang khác"],
];

export function HtmlLab() {
  const [code, setCode] = useState(HTML_START);
  // khung xem trước KHÔNG cho chạy script (sandbox rỗng) → an toàn
  const doc = `<!doctype html><meta charset="utf-8"><body style="font-family:system-ui,sans-serif;margin:12px;line-height:1.5">${code}</body>`;
  return (
    <div className="glass p-4 sm:p-6 space-y-4">
      <p className="text-ink-2 leading-relaxed">
        HTML dùng các <b className="text-ink">thẻ</b> đặt trong dấu nhọn để “dán nhãn” cho từng phần nội dung. Hầu hết thẻ đi theo cặp:
        thẻ mở <code className="font-bold" style={{ color: TECH.html.ink }}>&lt;p&gt;</code> và thẻ đóng <code className="font-bold" style={{ color: TECH.html.ink }}>&lt;/p&gt;</code> (có dấu /), nội dung nằm ở giữa.
      </p>
      <div className="grid lg:grid-cols-2 gap-4 [&>*]:min-w-0">
        <label className="block">
          <span className="flex items-center justify-between font-bold text-ink-2 mb-2">
            ✍️ Sửa code ở đây
            <button type="button" onClick={() => setCode(HTML_START)} className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-deep cursor-pointer"><RotateCcw className="size-4" aria-hidden /> Làm lại</button>
          </span>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} rows={14}
            className="w-full rounded-2xl bg-slate-900 text-orange-100 font-mono text-sm p-4 leading-relaxed outline-none focus:ring-4 focus:ring-orange-300/50 resize-y" />
        </label>
        <div>
          <p className="font-bold text-ink-2 mb-2">👀 Trình duyệt hiển thị</p>
          <iframe title="Kết quả HTML" sandbox="" srcDoc={doc} className="w-full h-[340px] rounded-2xl bg-white border-2 border-slate-200" />
        </div>
      </div>
      <p className="text-sm font-semibold text-ink-2 rounded-xl p-3" style={{ background: TECH.html.soft }}>
        💡 Thử xem: đổi “40” thành số bạn lớp mình, thêm một dòng <code>&lt;li&gt;Ngữ văn&lt;/li&gt;</code>, hoặc đổi <code>h2</code> thành <code>h1</code>.
      </p>
      <details className="rounded-2xl bg-white/70 border border-orange-100 p-4">
        <summary className="font-bold text-ink cursor-pointer">📖 Bảng các thẻ hay dùng</summary>
        <dl className="mt-3 grid sm:grid-cols-2 gap-2">
          {TAGS.map(([t, d]) => (
            <div key={t} className="rounded-xl bg-white p-3 border border-orange-50">
              <dt className="font-mono font-bold text-sm" style={{ color: TECH.html.ink }}>{t}</dt>
              <dd className="text-sm text-ink-2">{d}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}

/* =============================== CSS =============================== */
const COLORS = [["#0284c7", "xanh dương"], ["#059669", "xanh lá"], ["#e11d48", "đỏ hồng"], ["#7c3aed", "tím"], ["#d97706", "cam"]] as const;

export function CssLab() {
  const [bg, setBg] = useState<string>(COLORS[0][0]);
  const [radius, setRadius] = useState(16);
  const [size, setSize] = useState(20);
  const [pad, setPad] = useState(16);
  const [shadow, setShadow] = useState(true);
  const code = `.nut-bat-dau {
  background: ${bg};
  color: white;
  border-radius: ${radius}px;
  font-size: ${size}px;
  padding: ${pad}px ${pad * 2}px;
  box-shadow: ${shadow ? "0 8px 20px #0005" : "none"};
}`;
  const slider = (label: string, v: number, set: (n: number) => void, min: number, max: number, hint: string) => (
    <label className="block">
      <span className="flex justify-between text-sm font-bold text-ink"><span>{label}</span><span className="font-mono" style={{ color: TECH.css.ink }}>{v}px</span></span>
      <input type="range" min={min} max={max} value={v} onChange={(e) => set(Number(e.target.value))} className="w-full accent-blue-600 h-8 cursor-pointer" />
      <span className="text-xs text-ink-3">{hint}</span>
    </label>
  );
  return (
    <div className="glass p-4 sm:p-6 space-y-4">
      <p className="text-ink-2 leading-relaxed">
        CSS là các <b className="text-ink">quy tắc trang trí</b>. Mỗi quy tắc gồm: <b className="text-ink">chọn ai</b> (vd <code className="font-bold" style={{ color: TECH.css.ink }}>.nut-bat-dau</code>),
        rồi trong ngoặc nhọn là danh sách <b className="text-ink">thuộc tính: giá trị;</b> — giống như dặn thợ sơn “cái cửa này: màu xanh, bo góc tròn”.
      </p>
      <div className="grid lg:grid-cols-2 gap-5 [&>*]:min-w-0">
        <div className="space-y-4">
          <fieldset>
            <legend className="text-sm font-bold text-ink mb-1">Màu nền (background)</legend>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(([c, n]) => (
                <button key={c} type="button" onClick={() => { setBg(c); sfx.tap(); }} aria-label={`Màu ${n}`} aria-pressed={bg === c}
                  className={cx("size-11 rounded-xl border-4 cursor-pointer transition", bg === c ? "border-slate-800 scale-110" : "border-white")} style={{ background: c }} />
              ))}
            </div>
          </fieldset>
          {slider("Bo góc (border-radius)", radius, setRadius, 0, 40, "0 = góc vuông, càng lớn càng tròn")}
          {slider("Cỡ chữ (font-size)", size, setSize, 12, 36, "Chữ to hay nhỏ")}
          {slider("Khoảng đệm (padding)", pad, setPad, 4, 32, "Khoảng trống giữa chữ và mép nút")}
          <label className="inline-flex items-center gap-2 font-bold text-ink cursor-pointer">
            <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} className="size-5 accent-blue-600" /> Đổ bóng (box-shadow)
          </label>
        </div>
        <div className="space-y-3">
          <div className="grid place-items-center min-h-44 rounded-2xl bg-white border-2 border-slate-200 p-4">
            <button type="button" onClick={() => sfx.start()} className="font-extrabold text-white transition-all duration-200 cursor-pointer"
              style={{ background: bg, borderRadius: radius, fontSize: size, padding: `${pad}px ${pad * 2}px`, boxShadow: shadow ? "0 8px 20px #0005" : "none" }}>
              Bắt đầu
            </button>
          </div>
          <CodeBlock code={code} lang="css" />
        </div>
      </div>
      <p className="text-sm font-semibold text-ink-2 rounded-xl p-3" style={{ background: TECH.css.soft }}>
        💡 Một quy tắc CSS có thể áp cho <b>hàng trăm</b> nút cùng lúc. Muốn đổi màu cả trang web chỉ cần sửa một dòng — đó là sức mạnh của CSS.
      </p>
    </div>
  );
}

/* =============================== JavaScript =============================== */
const JS_CODE = `let diem = 0;

function traLoi(dapAn) {
  if (dapAn === "B") {
    diem = diem + 10;
    hienThi("Đúng rồi! 🎉");
  } else {
    hienThi("Chưa đúng 😅");
  }
}`;

type Trace = { line: number; note: string; diem?: number; msg?: string };

export function JsLab() {
  const [diem, setDiem] = useState(0);
  const [active, setActive] = useState<number[]>([]);
  const [note, setNote] = useState("Bấm một đáp án để chạy hàm traLoi(…) và xem máy tính đi qua từng dòng.");
  const [msg, setMsg] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const run = (pick: "A" | "B") => {
    if (running) return;
    timers.current.forEach(clearTimeout);
    setRunning(true); setMsg(null); sfx.tap();
    const ok = pick === "B";
    const steps: Trace[] = [
      { line: 2, note: `Gọi hàm traLoi("${pick}") — biến dapAn nhận giá trị "${pick}".` },
      { line: 3, note: `Kiểm tra: "${pick}" === "B" ? → ${ok ? "ĐÚNG (true)" : "SAI (false)"}` },
      ...(ok
        ? [{ line: 4, note: `diem = ${diem} + 10 → diem bây giờ là ${diem + 10}`, diem: diem + 10 },
          { line: 5, note: "Hiển thị lời khen lên màn hình.", msg: "Đúng rồi! 🎉" }]
        : [{ line: 7, note: "Vì điều kiện sai nên nhảy xuống nhánh else, bỏ qua dòng cộng điểm.", msg: "Chưa đúng 😅" }]),
    ];
    steps.forEach((s, i) => {
      timers.current.push(window.setTimeout(() => {
        setActive([s.line]); setNote(s.note);
        if (s.diem !== undefined) setDiem(s.diem);
        if (s.msg) { setMsg(s.msg); if (ok) sfx.correct(); else sfx.wrong(); }
        if (i === steps.length - 1) timers.current.push(window.setTimeout(() => { setRunning(false); setActive([]); }, 1400));
      }, i * 1100));
    });
  };
  const reset = () => { timers.current.forEach(clearTimeout); setDiem(0); setMsg(null); setActive([0]); setNote("diem được đặt lại bằng 0."); setRunning(false); };

  return (
    <div className="glass p-4 sm:p-6 space-y-4">
      <p className="text-ink-2 leading-relaxed">
        JavaScript là <b className="text-ink">ngôn ngữ lập trình</b>: một danh sách mệnh lệnh để máy tính làm theo <b className="text-ink">từng dòng, từ trên xuống</b>.
        Nó có <b className="text-ink">biến</b> (chiếc hộp có tên để cất giá trị, như <code>diem</code>), <b className="text-ink">hàm</b> (một nhóm lệnh có tên, gọi khi cần)
        và <b className="text-ink">câu lệnh điều kiện</b> <code>if … else</code> (nếu … thì … ngược lại …) — giống hệt bài thuật toán trong môn Tin học.
      </p>
      <div className="grid lg:grid-cols-2 gap-5 items-start [&>*]:min-w-0">
        <CodeBlock code={JS_CODE} lang="js" active={active} />
        <div className="space-y-3">
          <div className="rounded-2xl bg-white border-2 border-slate-200 p-4">
            <p className="font-black text-ink">Câu hỏi: 2 + 3 × 4 = ?</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" disabled={running} onClick={() => run("A")} className="min-h-12 rounded-2xl bg-sky-100 font-extrabold text-sky-900 disabled:opacity-50 cursor-pointer hover:bg-sky-200">A. 20</button>
              <button type="button" disabled={running} onClick={() => run("B")} className="min-h-12 rounded-2xl bg-sky-100 font-extrabold text-sky-900 disabled:opacity-50 cursor-pointer hover:bg-sky-200">B. 14</button>
            </div>
            <p className={cx("mt-3 min-h-7 font-extrabold", msg?.startsWith("Đúng") ? "text-emerald-700" : "text-red-600")} aria-live="polite">{msg}</p>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-3 items-center rounded-2xl p-4" style={{ background: TECH.js.soft }}>
            <div className="grid place-items-center rounded-xl border-2 border-dashed px-4 py-2" style={{ borderColor: TECH.js.color }}>
              <span className="text-xs font-bold text-ink-3">hộp “diem”</span>
              <span className="font-mono font-black text-2xl" style={{ color: TECH.js.ink }}>{diem}</span>
            </div>
            <p className="text-sm font-semibold text-ink" aria-live="polite"><Play className="inline size-4 mr-1" style={{ color: TECH.js.color }} aria-hidden />{note}</p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm font-bold text-ink-3 hover:text-deep cursor-pointer"><RotateCcw className="size-4" aria-hidden /> Đặt lại điểm</button>
        </div>
      </div>
    </div>
  );
}

/* =============================== Cơ sở dữ liệu =============================== */
type Row = { id: number; ten: string; lop: string; mon: string; diem: number };
const ROWS: Row[] = [
  { id: 1, ten: "An", lop: "6A", mon: "Toán", diem: 9 },
  { id: 2, ten: "Bình", lop: "7B", mon: "Tin học", diem: 10 },
  { id: 3, ten: "Chi", lop: "6A", mon: "Tin học", diem: 7 },
  { id: 4, ten: "Dũng", lop: "8C", mon: "Toán", diem: 6 },
  { id: 5, ten: "Hà", lop: "7B", mon: "Toán", diem: 8 },
  { id: 6, ten: "Khánh", lop: "8C", mon: "Tin học", diem: 9 },
  { id: 7, ten: "Lan", lop: "6A", mon: "KHTN", diem: 10 },
  { id: 8, ten: "Minh", lop: "7B", mon: "KHTN", diem: 5 },
];
const COLS: { k: keyof Row; label: string }[] = [
  { k: "id", label: "id" }, { k: "ten", label: "ten" }, { k: "lop", label: "lop" }, { k: "mon", label: "mon" }, { k: "diem", label: "diem" },
];

export function DbLab() {
  const [lop, setLop] = useState("");
  const [mon, setMon] = useState("");
  const [sort, setSort] = useState(false);
  const [limit, setLimit] = useState(0);
  const result = useMemo(() => {
    let r = ROWS.filter((x) => (!lop || x.lop === lop) && (!mon || x.mon === mon));
    if (sort) r = [...r].sort((a, b) => b.diem - a.diem);
    if (limit) r = r.slice(0, limit);
    return r;
  }, [lop, mon, sort, limit]);
  const hit = new Set(result.map((r) => r.id));
  const where = [lop && `lop = '${lop}'`, mon && `mon = '${mon}'`].filter(Boolean);
  const sql = [`SELECT * FROM diem_thi`, where.length ? `WHERE ${where.join(" AND ")}` : "", sort ? "ORDER BY diem DESC" : "", limit ? `LIMIT ${limit}` : ""].filter(Boolean).join("\n") + ";";
  const sel = "min-h-11 rounded-xl border-2 border-emerald-100 bg-white px-3 font-bold text-ink cursor-pointer";

  return (
    <div className="glass p-4 sm:p-6 space-y-4">
      <p className="text-ink-2 leading-relaxed">
        Cơ sở dữ liệu cất thông tin thành các <b className="text-ink">bảng</b>, giống bảng tính Excel: mỗi <b className="text-ink">cột</b> là một loại thông tin (tên, lớp, điểm),
        mỗi <b className="text-ink">hàng</b> là một bản ghi (một bạn học sinh). Để lấy dữ liệu, ta “hỏi” bằng ngôn ngữ <b className="text-ink">SQL</b> — gần như nói tiếng Anh:
        <i> SELECT</i> = chọn, <i>FROM</i> = từ bảng, <i>WHERE</i> = với điều kiện, <i>ORDER BY</i> = sắp xếp theo.
      </p>
      <div className="flex flex-wrap gap-2 items-end">
        <label className="grid text-sm font-bold text-ink-2">Lớp
          <select className={sel} value={lop} onChange={(e) => setLop(e.target.value)}><option value="">Tất cả</option><option>6A</option><option>7B</option><option>8C</option></select>
        </label>
        <label className="grid text-sm font-bold text-ink-2">Môn
          <select className={sel} value={mon} onChange={(e) => setMon(e.target.value)}><option value="">Tất cả</option><option>Toán</option><option>Tin học</option><option>KHTN</option></select>
        </label>
        <label className="grid text-sm font-bold text-ink-2">Lấy
          <select className={sel} value={limit} onChange={(e) => setLimit(Number(e.target.value))}><option value={0}>Tất cả</option><option value={1}>1 hàng</option><option value={3}>3 hàng</option></select>
        </label>
        <label className="inline-flex items-center gap-2 min-h-11 font-bold text-ink cursor-pointer"><input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} className="size-5 accent-emerald-600" /> Điểm cao xếp trước</label>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 items-start">
        <div>
          <p className="font-bold text-ink-2 mb-2">Câu hỏi bằng SQL (tự thay đổi theo lựa chọn):</p>
          <CodeBlock code={sql} lang="sql" />
          <p className="mt-3 font-bold text-ink-2">Kết quả: <span style={{ color: TECH.db.ink }}>{result.length} hàng</span></p>
          <ol className="mt-1 space-y-1">
            {result.map((r, i) => <li key={r.id} className="rounded-xl bg-emerald-50 px-3 py-2 font-semibold text-ink">{sort ? `${i + 1}. ` : ""}{r.ten} · {r.lop} · {r.mon} · <b>{r.diem} điểm</b></li>)}
            {!result.length && <li className="text-ink-3">Không có hàng nào khớp.</li>}
          </ol>
        </div>
        <div className="overflow-x-auto">
          <p className="font-bold text-ink-2 mb-2">Bảng <code style={{ color: TECH.db.ink }}>diem_thi</code> trong cơ sở dữ liệu:</p>
          <table className="w-full text-sm bg-white rounded-2xl overflow-hidden border-2 border-emerald-100">
            <caption className="sr-only">Bảng diem_thi, các hàng được chọn được tô màu</caption>
            <thead><tr className="bg-emerald-600 text-white">{COLS.map((c) => <th key={c.k} scope="col" className="px-2 py-2 text-left font-mono">{c.label}</th>)}</tr></thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.id} className={cx("border-t border-emerald-50 transition-colors", hit.has(r.id) ? "bg-emerald-100 font-bold text-ink" : "text-ink-3 opacity-60")}>
                  {COLS.map((c) => <td key={c.k} className="px-2 py-1.5">{r[c.k]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-ink-3">Hàng tô xanh là hàng khớp với câu hỏi. Dữ liệu chỉ là ví dụ.</p>
        </div>
      </div>
      <p className="text-sm font-semibold text-ink-2 rounded-xl p-3" style={{ background: TECH.db.soft }}>
        💡 Bảng xếp hạng của Đấu Trường chính là một câu SQL kiểu <code>ORDER BY diem DESC LIMIT 10</code> — sắp điểm từ cao xuống thấp rồi lấy 10 bạn đầu.
      </p>
    </div>
  );
}
