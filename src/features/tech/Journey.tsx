"use client";
import { Database, Globe, Server, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/features/arena/components/ui";
import { sfx } from "@/lib/sfx";
import { TECH } from "./shared";

/* ---------------- Hành trình của một cú bấm ---------------- */
const STOPS = [
  { icon: Smartphone, name: "Điện thoại của em", color: TECH.js.color },
  { icon: Globe, name: "Internet", color: "#64748b" },
  { icon: Server, name: "Máy chủ", color: "#0284c7" },
  { icon: Database, name: "Cơ sở dữ liệu", color: TECH.db.color },
];
const LEGS: { at: number; dir: 1 | -1; text: string }[] = [
  { at: 0, dir: 1, text: "Em bấm đáp án B. JavaScript trên điện thoại đóng gói câu trả lời thành một “lá thư” gửi đi." },
  { at: 1, dir: 1, text: "Lá thư chạy qua Internet (sóng điện thoại, cáp quang…) tới địa chỉ thcsngason.online, mất chưa tới nửa giây." },
  { at: 2, dir: 1, text: "Máy chủ đọc thư, kiểm tra đáp án đúng (học sinh không xem trộm được) rồi tính điểm theo tốc độ trả lời." },
  { at: 3, dir: 1, text: "Máy chủ ghi kết quả vào cơ sở dữ liệu và hỏi: “Bạn này giờ xếp hạng mấy?”." },
  { at: 2, dir: -1, text: "Cơ sở dữ liệu trả lời. Máy chủ viết thư hồi âm: đúng, +10 điểm, hạng 3." },
  { at: 0, dir: -1, text: "Thư hồi âm về tới điện thoại. JavaScript đổi màu ô đáp án thành xanh, CSS làm hiệu ứng, phát tiếng “ting”! 🎉" },
];

export function Journey() {
  const [leg, setLeg] = useState(-1);
  const [auto, setAuto] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!auto) return;
    timer.current = window.setTimeout(() => {
      if (leg >= LEGS.length - 1) { setAuto(false); sfx.correct(); return; }
      setLeg(leg + 1); sfx.next();
    }, leg < 0 ? 100 : 2200);
    return () => window.clearTimeout(timer.current);
  }, [auto, leg]);
  const cur = leg >= 0 ? LEGS[leg] : null;
  const play = () => { setLeg(-1); setAuto(true); sfx.start(); };

  return (
    <div className="glass p-4 sm:p-6">
      <ol className="grid grid-cols-4 gap-1 sm:gap-3 relative">
        {STOPS.map((s, i) => {
          const on = cur?.at === i;
          return (
            <li key={s.name} className="flex flex-col items-center text-center">
              <span className={cx("grid place-items-center size-14 sm:size-20 rounded-2xl sm:rounded-3xl text-white transition-all duration-500", on ? "scale-110 shadow-[0_0_0_6px_rgba(250,204,21,.6)]" : "opacity-80")}
                style={{ background: s.color }}>
                <s.icon className="size-7 sm:size-10" aria-hidden />
              </span>
              <span className="mt-2 text-xs sm:text-sm font-extrabold text-ink leading-tight">{s.name}</span>
              {on && <span className="mt-1 text-lg" aria-hidden>{cur.dir === 1 ? "📨" : "📬"}</span>}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 h-2 rounded-full bg-sky-100 overflow-hidden" aria-hidden>
        <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-500" style={{ width: `${((leg + 1) / LEGS.length) * 100}%` }} />
      </div>
      <p className="mt-4 min-h-20 rounded-2xl bg-white/80 p-4 font-semibold text-ink leading-relaxed" aria-live="polite">
        {cur ? <><b className="text-deep">{leg + 1}/{LEGS.length} {cur.dir === 1 ? "→ đi" : "← về"}:</b> {cur.text}</> : "Bấm “Xem hành trình” để theo dõi điều gì xảy ra trong khoảng một giây sau khi em chọn đáp án ở Đấu Trường."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={play} className="min-h-12 px-5 rounded-2xl btn-primary font-extrabold cursor-pointer">▶ Xem hành trình</button>
        <button type="button" disabled={auto || leg >= LEGS.length - 1} onClick={() => { setLeg(leg + 1); sfx.next(); }} className="min-h-12 px-5 rounded-2xl bg-white border border-sky-100 font-bold text-ink-2 disabled:opacity-40 cursor-pointer">Từng bước →</button>
      </div>
      <p className="mt-4 text-sm text-ink-2"><b>Phía trước</b> (front-end) là phần chạy trên điện thoại của em: HTML, CSS, JavaScript. <b>Phía sau</b> (back-end) là phần chạy trên máy chủ ở xa: cũng viết bằng JavaScript và nói chuyện với cơ sở dữ liệu.</p>
    </div>
  );
}

/* ---------------- Đố vui ---------------- */
const QUIZ = [
  { q: "Muốn đổi màu chữ của tiêu đề thành màu đỏ, em sửa phần nào?", o: ["HTML", "CSS", "JavaScript", "Cơ sở dữ liệu"], a: 1, why: "CSS lo việc trang trí: màu sắc, cỡ chữ, bố cục." },
  { q: "Đồng hồ đếm ngược 20 giây ở Đấu Trường được làm bằng gì?", o: ["HTML", "CSS", "JavaScript", "Cơ sở dữ liệu"], a: 2, why: "JavaScript làm cho trang “hành động”: đếm giờ, chấm điểm, phản hồi khi bấm." },
  { q: "Hơn 2.000 câu hỏi của trang web được cất ở đâu?", o: ["Trong file CSS", "Trong cơ sở dữ liệu", "Trong điện thoại của em", "Trong thẻ <button>"], a: 1, why: "Cơ sở dữ liệu là “tủ hồ sơ” cất câu hỏi, điểm số, bảng xếp hạng." },
  { q: "Thẻ HTML nào dùng để tạo một nút bấm?", o: ["<p>", "<h1>", "<button>", "<ul>"], a: 2, why: "<button> … </button> tạo nút bấm." },
  { q: "Câu SQL nào lấy các bạn lớp 7B?", o: ["SELECT * FROM hoc_sinh WHERE lop = '7B'", "DELETE lop 7B", "<p>7B</p>", "color: 7B;"], a: 0, why: "SELECT … FROM … WHERE … là câu “hỏi” dữ liệu có điều kiện." },
];

export function TechQuiz() {
  const [picks, setPicks] = useState<(number | null)[]>(QUIZ.map(() => null));
  const done = picks.every((p) => p !== null);
  const score = picks.filter((p, i) => p === QUIZ[i].a).length;
  const choose = (qi: number, oi: number) => {
    if (picks[qi] !== null) return;
    const next = picks.map((p, i) => (i === qi ? oi : p));
    setPicks(next);
    if (oi === QUIZ[qi].a) sfx.correct(); else sfx.wrong();
    if (next.every((p) => p !== null)) window.setTimeout(() => sfx.fanfare(), 500);
  };
  return (
    <div className="space-y-4">
      {QUIZ.map((x, qi) => (
        <fieldset key={qi} className="glass p-4 sm:p-5">
          <legend className="sr-only">Câu {qi + 1}</legend>
          <p className="font-black text-ink"><span className="text-deep">Câu {qi + 1}.</span> {x.q}</p>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {x.o.map((o, oi) => {
              const p = picks[qi];
              const st = p === null ? null : oi === x.a ? "ok" : oi === p ? "bad" : null;
              return (
                <button key={oi} type="button" disabled={p !== null} onClick={() => choose(qi, oi)}
                  className={cx("min-h-12 rounded-2xl px-4 text-left font-bold border-2 transition",
                    st === "ok" ? "bg-emerald-500 border-emerald-500 text-white" : st === "bad" ? "bg-red-500 border-red-500 text-white" : "bg-white border-sky-100 text-ink",
                    p === null && "hover:border-sky-400 cursor-pointer", p !== null && !st && "opacity-50")}>
                  {"ABCD"[oi]}. {o}
                </button>
              );
            })}
          </div>
          {picks[qi] !== null && <p className={cx("mt-2 text-sm font-bold", picks[qi] === x.a ? "text-emerald-700" : "text-red-600")}>{picks[qi] === x.a ? "✔ Chính xác! " : "✘ Chưa đúng. "}<span className="text-ink-2 font-semibold">{x.why}</span></p>}
        </fieldset>
      ))}
      {done && (
        <div className="glass p-5 text-center" aria-live="polite">
          <p className="text-4xl" aria-hidden>{score === QUIZ.length ? "🏆" : score >= 3 ? "🌟" : "💪"}</p>
          <p className="mt-1 font-black text-ink text-xl">Em đúng {score}/{QUIZ.length} câu!</p>
          <p className="text-ink-2">{score === QUIZ.length ? "Xuất sắc — em đã hiểu cách một trang web hoạt động." : "Kéo lên xem lại các phần rồi thử lần nữa nhé."}</p>
          <button type="button" onClick={() => setPicks(QUIZ.map(() => null))} className="mt-3 min-h-11 px-5 rounded-2xl bg-white border border-sky-100 font-bold text-deep cursor-pointer">Làm lại</button>
        </div>
      )}
    </div>
  );
}
