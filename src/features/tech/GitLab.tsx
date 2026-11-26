"use client";
import { Cloud, GitCommitHorizontal, History, Laptop, RotateCcw, Upload } from "lucide-react";
import { useState } from "react";
import { cx } from "@/features/arena/components/ui";
import { sfx } from "@/lib/sfx";
import { TECH } from "./shared";

/* ---------------- Ví von: Git = điểm lưu, GitHub = kho trên mạng ---------------- */
const IDEAS = [
  {
    emoji: "💾", title: "Git", say: "Chiếc máy ảnh chụp lại code",
    text: "Mỗi lần làm xong một việc, em “chụp” lại toàn bộ code thành một điểm lưu, giống như lưu game trước khi đánh trùm. Lỡ làm hỏng thì quay về điểm lưu cũ.",
  },
  {
    emoji: "📸", title: "Commit", say: "Một tấm ảnh trong album",
    text: "Mỗi điểm lưu gọi là một commit, kèm một dòng ghi chú do em viết: “Thêm nút Bắt đầu”, “Sửa lỗi chính tả”… Nhìn album là biết ai sửa gì, lúc nào.",
  },
  {
    emoji: "☁️", title: "GitHub", say: "Thư viện code trên Internet",
    text: "Một trang web cất bản sao album đó trên mạng. Máy hỏng vẫn còn code; bạn bè ở nhà khác cũng xem và cùng làm được. Đẩy code lên gọi là push.",
  },
];

export function GitIdeas() {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {IDEAS.map((x) => (
        <li key={x.title} className="glass p-5">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>{x.emoji}</span>
            <div>
              <p className="font-black text-lg" style={{ color: TECH.git.ink }}>{x.title}</p>
              <p className="text-sm font-bold text-ink-3">= {x.say}</p>
            </div>
          </div>
          <p className="mt-3 text-ink-2 leading-relaxed">{x.text}</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Khu thực hành: sửa → commit → quay lại → push ---------------- */
type Commit = { id: string; msg: string; text: string };

const FIRST = `<h1>Trang của em</h1>
<p>Em tên là ...</p>`;
const START: Commit[] = [{ id: "a1b2c3d", msg: "Tạo trang đầu tiên", text: FIRST }];
const newId = () => Math.random().toString(16).slice(2, 9).padEnd(7, "0");

/** So sánh từng dòng: dòng mới thêm (+) và dòng bị xoá (−) */
function diff(oldText: string, newText: string) {
  const a = oldText.split("\n"), b = newText.split("\n");
  return [
    ...a.filter((l) => !b.includes(l)).map((l) => ({ sign: "−", line: l })),
    ...b.filter((l) => !a.includes(l)).map((l) => ({ sign: "+", line: l })),
  ];
}

export function GitLab() {
  const [text, setText] = useState(FIRST);
  const [commits, setCommits] = useState<Commit[]>(START);
  const [msg, setMsg] = useState("");
  const [pushed, setPushed] = useState(1); // số commit đã có trên GitHub
  const [log, setLog] = useState<string[]>(["git init", 'git commit -m "Tạo trang đầu tiên"', "git push"]);
  const [hint, setHint] = useState("Sửa code ở khung bên trái, ví dụ điền tên em, rồi viết ghi chú và bấm “Lưu điểm (commit)”.");

  const last = commits.at(-1)!;
  const changes = diff(last.text, text);
  const run = (...cmds: string[]) => setLog((l) => [...l, ...cmds].slice(-8));

  const commit = () => {
    if (!changes.length) { setHint("Chưa có gì thay đổi so với điểm lưu gần nhất, nên chưa cần commit."); sfx.wrong(); return; }
    const m = msg.trim();
    if (!m) { setHint("Hãy viết một dòng ghi chú ngắn cho biết em vừa sửa gì. Sau này đọc lại sẽ hiểu ngay."); sfx.wrong(); return; }
    setCommits((c) => [...c, { id: newId(), msg: m, text }]);
    run("git add .", `git commit -m "${m}"`);
    setMsg("");
    setHint("Đã lưu! Điểm lưu mới nằm trong máy em. Bấm “Đẩy lên GitHub” để cất bản sao lên mạng.");
    sfx.correct();
  };

  const restore = (c: Commit) => {
    setText(c.text);
    run(`git restore --source=${c.id} .`);
    setHint(`Đã đưa code về đúng như lúc “${c.msg}”. Các điểm lưu sau vẫn còn nguyên, không mất gì.`);
    sfx.next();
  };

  const push = () => {
    if (pushed === commits.length) { setHint("GitHub đã có đủ mọi điểm lưu, không cần đẩy thêm."); sfx.wrong(); return; }
    run("git push");
    setHint(`Đã đẩy ${commits.length - pushed} điểm lưu lên GitHub. Giờ máy em có hỏng thì code vẫn còn trên mạng.`);
    setPushed(commits.length);
    sfx.fanfare();
  };

  const reset = () => { setText(FIRST); setCommits(START); setPushed(1); setMsg(""); setLog(["git init", 'git commit -m "Tạo trang đầu tiên"', "git push"]); };

  return (
    <div className="glass p-4 sm:p-6 space-y-4">
      <div className="grid lg:grid-cols-2 gap-4 [&>*]:min-w-0">
        {/* Máy của em */}
        <div className="space-y-3">
          <p className="flex items-center justify-between font-bold text-ink-2">
            <span className="inline-flex items-center gap-2"><Laptop className="size-5" aria-hidden /> Máy tính của em</span>
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-deep cursor-pointer"><RotateCcw className="size-4" aria-hidden /> Làm lại</button>
          </p>
          <label className="block">
            <span className="sr-only">Code trang web</span>
            <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} rows={6}
              className="w-full rounded-2xl bg-slate-900 text-orange-100 font-mono text-sm p-4 leading-relaxed outline-none focus:ring-4 focus:ring-orange-300/50 resize-y" />
          </label>
          <div className="rounded-2xl bg-white/80 p-3 text-sm">
            <p className="font-bold text-ink-2">Thay đổi chưa lưu:</p>
            {changes.length ? (
              <ul className="mt-1 font-mono space-y-0.5">
                {changes.map((d, i) => (
                  <li key={i} className={cx("rounded px-2 break-all", d.sign === "+" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700")}>{d.sign} {d.line || "(dòng trống)"}</li>
                ))}
              </ul>
            ) : <p className="mt-1 text-ink-3">Không có. Code giống hệt điểm lưu gần nhất.</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="flex-1">
              <span className="sr-only">Ghi chú cho điểm lưu</span>
              <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commit()} maxLength={50}
                placeholder="vd: Điền tên em" className="w-full min-h-12 rounded-2xl border-2 border-sky-100 bg-white px-4 font-semibold text-ink outline-none focus:border-sky-400" />
            </label>
            <button type="button" onClick={commit} className="min-h-12 px-5 rounded-2xl btn-primary font-extrabold cursor-pointer inline-flex items-center justify-center gap-2">
              <GitCommitHorizontal className="size-5" aria-hidden /> Lưu điểm (commit)
            </button>
          </div>
        </div>

        {/* Album điểm lưu + GitHub */}
        <div className="space-y-3">
          <p className="font-bold text-ink-2 inline-flex items-center gap-2"><History className="size-5" aria-hidden /> Album điểm lưu (mới nhất ở trên)</p>
          <ol className="space-y-2">
            {[...commits].reverse().map((c) => {
              const i = commits.indexOf(c);
              const online = i < pushed;
              return (
                <li key={c.id} className="rounded-2xl bg-white/80 border border-sky-100 p-3 flex items-center gap-3">
                  <span className="grid place-items-center size-9 rounded-full text-white shrink-0" style={{ background: TECH.git.color }}><GitCommitHorizontal className="size-5" aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink truncate">{c.msg}</p>
                    <p className="text-xs text-ink-3 font-mono">{c.id} · {online ? "☁️ đã có trên GitHub" : "💻 mới ở trong máy"}</p>
                  </div>
                  <button type="button" onClick={() => restore(c)} className="shrink-0 min-h-10 px-3 rounded-xl bg-white border border-sky-100 text-sm font-bold text-deep hover:border-sky-400 cursor-pointer">Quay về</button>
                </li>
              );
            })}
          </ol>
          <button type="button" onClick={push} className="w-full min-h-12 px-5 rounded-2xl font-extrabold text-white cursor-pointer inline-flex items-center justify-center gap-2" style={{ background: "#24292f" }}>
            <Upload className="size-5" aria-hidden /> Đẩy lên GitHub (push)
            {commits.length > pushed && <span className="rounded-full bg-white/20 px-2 text-sm">{commits.length - pushed} chưa đẩy</span>}
          </button>
          <p className="text-sm text-ink-2 inline-flex items-center gap-2"><Cloud className="size-4 shrink-0" aria-hidden /> GitHub đang giữ {pushed}/{commits.length} điểm lưu.</p>
        </div>
      </div>

      <p className="min-h-12 rounded-2xl p-3 font-semibold text-ink" style={{ background: TECH.git.soft }} aria-live="polite">💡 {hint}</p>

      <div>
        <p className="font-bold text-ink-2 mb-2">⌨️ Lập trình viên thật gõ các lệnh này (em vừa làm bằng nút bấm):</p>
        <pre className="rounded-2xl bg-slate-900 text-emerald-200 text-[13px] sm:text-sm leading-relaxed p-3 sm:p-4 overflow-x-auto" aria-label="Các lệnh git tương ứng">
          <code>{log.map((l) => `$ ${l}`).join("\n")}</code>
        </pre>
      </div>
    </div>
  );
}
