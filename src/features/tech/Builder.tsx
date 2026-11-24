"use client";
import { Check, Database, FileCode2, Palette, Zap } from "lucide-react";
import { useState } from "react";
import { cx } from "@/features/arena/components/ui";
import { sfx } from "@/lib/sfx";
import { CodeBlock, TECH, type TechKey } from "./shared";

/* ---------------- Ví von: xây một ngôi nhà ---------------- */
const HOUSE: { key: TechKey; icon: typeof FileCode2; emoji: string; say: string; example: string }[] = [
  { key: "html", icon: FileCode2, emoji: "🧱", say: "Dựng khung: đâu là tường, đâu là cửa, đâu là phòng.", example: "Trên trang web: đâu là tiêu đề, đâu là câu hỏi, đâu là nút bấm." },
  { key: "css", icon: Palette, emoji: "🎨", say: "Sơn màu, lát gạch, kê đồ cho đẹp.", example: "Trên trang web: màu xanh, chữ to, góc bo tròn, xếp 2 cột." },
  { key: "js", icon: Zap, emoji: "💡", say: "Lắp điện nước để bấm công tắc thì đèn sáng.", example: "Trên trang web: bấm đáp án thì chấm đúng/sai, đồng hồ đếm ngược." },
  { key: "db", icon: Database, emoji: "🗄️", say: "Tủ hồ sơ cất giấy tờ, cần là lấy ra ngay.", example: "Trên trang web: kho hơn 2.000 câu hỏi, điểm số, bảng xếp hạng." },
];

export function HouseAnalogy() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {HOUSE.map((h) => {
        const t = TECH[h.key];
        return (
          <li key={h.key} className="glass p-5 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden>{h.emoji}</span>
              <div>
                <p className="font-black text-lg" style={{ color: t.ink }}>{t.name}</p>
                <p className="text-sm font-bold text-ink-3">= {t.role}</p>
              </div>
            </div>
            <p className="mt-3 text-ink font-semibold">{h.say}</p>
            <p className="mt-2 text-sm text-ink-2 rounded-xl p-3" style={{ background: t.soft }}>{h.example}</p>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- Lắp ráp thẻ câu hỏi qua 4 bước ---------------- */
const BANK = [
  { q: "Thủ đô của Việt Nam là thành phố nào?", options: ["Hà Nội", "Huế", "Đà Nẵng", "TP. Hồ Chí Minh"], answer: 0 },
  { q: "Nước sôi ở bao nhiêu độ C (ở áp suất thường)?", options: ["50 °C", "80 °C", "100 °C", "120 °C"], answer: 2 },
  { q: "2 + 3 × 4 bằng bao nhiêu?", options: ["20", "14", "24", "9"], answer: 1 },
];

const STEPS: { key: TechKey; title: string; text: string; lang: "html" | "css" | "js" | "sql"; code: string }[] = [
  {
    key: "html", title: "Bước 1 · HTML dựng khung",
    text: "Chỉ có HTML: trang đã có đủ chữ và nút, nhưng trông như tờ giấy đánh máy — chưa có màu, chưa đẹp, bấm vào cũng chưa có gì xảy ra.",
    lang: "html",
    code: `<div class="the-cau-hoi">
  <h3>Thủ đô của Việt Nam là thành phố nào?</h3>
  <button>A. Hà Nội</button>
  <button>B. Huế</button>
  <button>C. Đà Nẵng</button>
  <button>D. TP. Hồ Chí Minh</button>
</div>`,
  },
  {
    key: "css", title: "Bước 2 · CSS trang trí",
    text: "Thêm CSS: cùng những thẻ HTML đó nhưng giờ có màu nền, chữ đậm, góc bo tròn, xếp thành 2 cột. Nội dung không đổi, chỉ đổi cách trình bày.",
    lang: "css",
    code: `.the-cau-hoi {
  background: white;
  border-radius: 20px;   /* bo tròn góc */
  padding: 20px;
}
button {
  background: #e0f2fe;   /* xanh nhạt */
  border-radius: 14px;
  font-weight: bold;
}`,
  },
  {
    key: "js", title: "Bước 3 · JavaScript làm cho nó “sống”",
    text: "Thêm JavaScript: giờ bấm vào đáp án thì máy kiểm tra đúng hay sai, đổi màu xanh/đỏ và cộng điểm. Hãy thử bấm một đáp án!",
    lang: "js",
    code: `function chonDapAn(soThuTu) {
  if (soThuTu === dapAnDung) {
    toMauXanh();          // đúng
    diem = diem + 10;
  } else {
    toMauDo();            // sai
  }
}`,
  },
  {
    key: "db", title: "Bước 4 · Cơ sở dữ liệu cung cấp câu hỏi",
    text: "Thêm cơ sở dữ liệu: câu hỏi không viết sẵn trong trang nữa mà được lấy ra từ kho. Bấm “Câu tiếp” — máy chủ lấy câu khác từ cơ sở dữ liệu và điền vào đúng cái khung đó.",
    lang: "sql",
    code: `-- Lấy 1 câu hỏi ngẫu nhiên môn Toán, khối 6
SELECT noi_dung, dap_an
FROM cau_hoi
WHERE mon = 'Toán' AND khoi = 6
ORDER BY RANDOM()
LIMIT 1;`,
  },
];

export function CardBuilder() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [qi, setQi] = useState(0);
  const s = STEPS[step];
  const css = step >= 1, js = step >= 2, db = step >= 3;
  const item = db ? BANK[qi] : BANK[0];

  const go = (i: number) => { setStep(i); setPicked(null); if (i < 3) setQi(0); sfx.tap(); };
  const choose = (i: number) => {
    if (!js || picked !== null) return;
    setPicked(i);
    if (i === item.answer) { setScore((x) => x + 10); sfx.correct(); } else sfx.wrong();
  };
  const nextQ = () => { setQi((x) => (x + 1) % BANK.length); setPicked(null); sfx.next(); };

  return (
    <div className="glass p-4 sm:p-6">
      {/* chọn bước */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist" aria-label="Các bước lắp ráp">
        {STEPS.map((x, i) => {
          const t = TECH[x.key];
          const on = i <= step;
          return (
            <button key={x.key} role="tab" aria-selected={i === step} onClick={() => go(i)}
              className={cx("min-h-12 rounded-2xl px-3 font-extrabold text-sm sm:text-base border-2 transition cursor-pointer flex items-center justify-center gap-2",
                i === step && "ring-4 ring-offset-1")}
              style={{ borderColor: t.color, background: on ? t.color : "white", color: on ? "white" : t.ink, ["--tw-ring-color" as string]: `${t.color}40` }}>
              {i < step && <Check className="size-4" aria-hidden />} + {t.name}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid lg:grid-cols-2 gap-5 items-start [&>*]:min-w-0">
        {/* kết quả */}
        <div>
          <p className="font-black text-ink text-lg" style={{ color: TECH[s.key].ink }}>{s.title}</p>
          <p className="mt-1 text-ink-2 leading-relaxed">{s.text}</p>
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-3 sm:p-4 min-h-64" aria-live="polite">
            <p className="text-xs font-bold text-ink-3 mb-2">Trình duyệt hiển thị:</p>
            {!css ? (
              <div style={{ fontFamily: "'Times New Roman', serif", color: "#000" }}>
                <h3 style={{ fontSize: 20, fontWeight: "bold", margin: "0 0 8px" }}>{item.q}</h3>
                {item.options.map((o, i) => (
                  <button key={i} onClick={() => choose(i)} style={{ display: "inline-block", margin: "2px 4px 2px 0", padding: "1px 6px", border: "2px outset #ddd", background: "#efefef", fontFamily: "Arial", fontSize: 13 }}>
                    {"ABCD"[i]}. {o}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] bg-gradient-to-br from-sky-50 to-white p-4 shadow-[0_10px_30px_-18px_rgba(2,132,199,.6)] border border-sky-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-sky-700 uppercase">{db ? `Câu ${qi + 1} · lấy từ cơ sở dữ liệu` : "Câu 1"}</span>
                  {js && <span className="text-xs font-extrabold rounded-full bg-amber-100 text-amber-800 px-2.5 py-1">⭐ {score} điểm</span>}
                </div>
                <h3 className="mt-2 font-black text-ink text-lg leading-snug">{item.q}</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {item.options.map((o, i) => {
                    const state = picked === null ? null : i === item.answer ? "ok" : i === picked ? "bad" : null;
                    return (
                      <button key={i} onClick={() => choose(i)} disabled={js && picked !== null}
                        className={cx("min-h-12 rounded-2xl px-3 text-left font-bold transition border-2",
                          state === "ok" ? "bg-emerald-500 border-emerald-500 text-white" : state === "bad" ? "bg-red-500 border-red-500 text-white" : "bg-sky-100 border-sky-100 text-sky-900",
                          js && picked === null && "hover:border-sky-400 cursor-pointer")}>
                        {"ABCD"[i]}. {o}
                      </button>
                    );
                  })}
                </div>
                {js && picked !== null && (
                  <p className={cx("mt-3 font-extrabold", picked === item.answer ? "text-emerald-700" : "text-red-600")}>
                    {picked === item.answer ? "🎉 Chính xác! +10 điểm" : `😅 Chưa đúng — đáp án là ${"ABCD"[item.answer]}`}
                  </p>
                )}
                {db && (
                  <button onClick={nextQ} className="mt-3 min-h-11 px-4 rounded-xl font-extrabold text-white cursor-pointer" style={{ background: TECH.db.color }}>
                    Câu tiếp → (hỏi cơ sở dữ liệu)
                  </button>
                )}
              </div>
            )}
            {!js && <p className="mt-3 text-xs text-ink-3">Thử bấm một nút: chưa có JavaScript nên không có gì xảy ra.</p>}
          </div>
        </div>
        {/* code */}
        <div>
          <p className="font-bold text-ink-2 mb-2">Đoạn code được thêm ở bước này:</p>
          <CodeBlock code={s.code} lang={s.lang} />
          <div className="mt-3 flex gap-2">
            <button onClick={() => go(Math.max(0, step - 1))} disabled={step === 0} className="min-h-11 px-4 rounded-xl bg-white border border-sky-100 font-bold text-ink-2 disabled:opacity-40 cursor-pointer">← Bước trước</button>
            <button onClick={() => go(Math.min(3, step + 1))} disabled={step === 3} className="min-h-11 px-4 rounded-xl btn-primary font-extrabold disabled:opacity-40 cursor-pointer">Bước tiếp →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
