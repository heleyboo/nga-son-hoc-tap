#!/usr/bin/env node
/**
 * Giả lập học sinh cho "Lớp học trực tiếp" — dùng để thử khi không có cả lớp thật.
 *
 *   node scripts/live-bots.mjs <mã-phòng> [số-học-sinh=30] [địa-chỉ=http://localhost:3000]
 *
 * Mỗi "học sinh ảo" vào phòng, nghe trạng thái qua SSE và trả lời ngẫu nhiên
 * với tốc độ khác nhau (một số bạn đôi khi không kịp trả lời). Ctrl+C để dừng.
 */
const [code, nArg = "30", base = "http://localhost:3000"] = process.argv.slice(2);
if (!/^\d{6}$/.test(code ?? "")) {
  console.error("Cách dùng: node scripts/live-bots.mjs <mã-phòng-6-số> [số-học-sinh] [địa-chỉ]");
  process.exit(1);
}
const N = Math.min(120, Math.max(1, Number(nArg) || 30));

const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đỗ", "Bùi", "Mai", "Lương"];
const TEN = ["An", "Bình", "Chi", "Dũng", "Giang", "Hà", "Huy", "Khánh", "Linh", "Minh", "Ngọc", "Phúc", "Quân", "Thảo", "Trang", "Tú", "Vy", "Yến", "Nam", "Hải"];
const LOP = ["6A", "6B", "7A", "7B", "8A", "9A"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let finished = 0;
const stats = { joined: 0, answers: 0, errors: 0 };

async function bot(i) {
  const name = `${pick(HO)} ${pick(TEN)}`;
  const skill = Math.random(); // bạn "nhanh tay" trả lời sớm hơn
  await sleep(Math.random() * 4000); // vào phòng rải rác như thật
  const jr = await fetch(`${base}/api/live/${code}/join`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, className: pick(LOP) }),
  });
  const seat = await jr.json();
  if (!jr.ok) { stats.errors++; console.error(`#${i} không vào được: ${seat.error}`); return; }
  stats.joined++;

  const res = await fetch(`${base}/api/live/${code}/stream?pid=${seat.playerId}&token=${encodeURIComponent(seat.token)}`);
  if (!res.ok || !res.body) { stats.errors++; return; }
  const answered = new Set();
  const dec = new TextDecoder();
  let buf = "";
  for await (const chunk of res.body) {
    buf += dec.decode(chunk, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n\n")) >= 0) {
      const block = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const line = block.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      const v = JSON.parse(line.slice(6));
      if (v.phase === "question" && v.myChoice === null && !answered.has(v.qIndex)) {
        answered.add(v.qIndex);
        const q = v.qIndex, opts = v.question.options.length, limit = v.seconds * 1000;
        // 8% không kịp trả lời; còn lại trả lời trong khoảng 15–95% thời gian
        if (Math.random() < 0.08) continue;
        const delay = limit * (0.15 + (1 - skill) * 0.5 + Math.random() * 0.3);
        setTimeout(async () => {
          const r = await fetch(`${base}/api/live/${code}/answer`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerId: seat.playerId, token: seat.token, qIndex: q, choice: Math.floor(Math.random() * opts) }),
          });
          if (r.ok) stats.answers++;
        }, Math.min(delay, limit - 300));
      }
      if (v.phase === "ended" || v.phase === "kicked" || v.phase === "closed") {
        finished++;
        return;
      }
    }
  }
}

console.log(`Đưa ${N} học sinh ảo vào phòng ${code} tại ${base} …`);
const timer = setInterval(() => console.log(`  đã vào: ${stats.joined}/${N} · câu trả lời đã gửi: ${stats.answers} · lỗi: ${stats.errors}`), 5000);
await Promise.allSettled(Array.from({ length: N }, (_, i) => bot(i + 1)));
clearInterval(timer);
console.log(`Xong. ${finished} học sinh ảo đã ở lại tới cuối · ${stats.answers} câu trả lời · ${stats.errors} lỗi.`);
