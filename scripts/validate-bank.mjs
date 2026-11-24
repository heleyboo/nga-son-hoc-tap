// Kiểm tra kho câu hỏi: node scripts/validate-bank.mjs [file-nháp.json ...]
// - questions.json (kho cũ, nới lỏng: cho phép 2 phương án Đúng/Sai)
// - bank/grade-*.json (kho mới, chặt: đúng 4 phương án, bắt buộc có giải thích)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const SEED = "src/db/seed";
const SUBJECTS = ["Toán", "Ngữ văn", "Tiếng Anh", "KHTN", "Lịch sử và Địa lý", "GDCD", "Tin học", "Công nghệ"];
const errors = [], warns = [];
const err = (code, msg) => errors.push(`${code}: ${msg}`);
const warn = (code, msg) => warns.push(`${code}: ${msg}`);
const norm = (s) => s.toLowerCase().normalize("NFC").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

const legacy = JSON.parse(readFileSync(`${SEED}/questions.json`, "utf8")).map((q) => ({ ...q, _src: "questions.json", _strict: false }));
const bankDir = `${SEED}/bank`;
const bank = existsSync(bankDir)
  ? readdirSync(bankDir).filter((f) => /^grade-\d\.json$/.test(f)).flatMap((f) =>
      JSON.parse(readFileSync(path.join(bankDir, f), "utf8")).map((q) => ({ ...q, _src: f, _strict: true })))
  : [];
// File nháp truyền thêm qua tham số: node scripts/validate-bank.mjs nhap1.json nhap2.json
const extra = process.argv.slice(2).flatMap((f) =>
  JSON.parse(readFileSync(f, "utf8")).map((q) => ({ ...q, _src: path.basename(f), _strict: true })));
const all = [...legacy, ...bank, ...extra];

const codes = new Map(), contents = new Map();
for (const q of all) {
  const c = q.code ?? "(thiếu code)";
  if (codes.has(c)) err(c, `trùng code (${codes.get(c)} và ${q._src})`);
  codes.set(c, q._src);

  const m = /^([6-9])-(CB|NC)-(\d{3})$/.exec(c);
  if (!m) err(c, "code sai định dạng G-CB|NC-NNN");
  else {
    if (Number(m[1]) !== q.grade) err(c, `grade ${q.grade} không khớp code`);
    if ((m[2] === "CB" ? "basic" : "advanced") !== q.level) err(c, `level ${q.level} không khớp code`);
  }
  if (!SUBJECTS.includes(q.subject)) err(c, `môn không hợp lệ: ${q.subject}`);
  if (typeof q.content !== "string" || q.content.trim().length < 5) err(c, "thiếu nội dung câu hỏi");
  if (!Array.isArray(q.options)) { err(c, "options không phải mảng"); continue; }
  if (q._strict ? q.options.length !== 4 : q.options.length < 2 || q.options.length > 4) err(c, `số phương án = ${q.options.length}`);
  const optKey = (o) => String(o).toLowerCase().normalize("NFC").replace(/\s+/g, "");
  if (new Set(q.options.map(optKey)).size !== q.options.length) err(c, "có phương án trùng nhau");
  if (q.options.some((o) => typeof o !== "string" || !o.trim())) err(c, "có phương án rỗng");
  if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length) err(c, `answerIndex ${q.answerIndex} ngoài phạm vi`);

  if (q._strict) {
    if (!q.explanation || q.explanation.trim().length < 10) err(c, "thiếu giải thích");
    if (!q.topic) warn(c, "thiếu topic");
    if (q.content.length > 200) warn(c, `câu hỏi dài ${q.content.length} ký tự (>200)`);
    if (q.options.some((o) => o.length > 60)) warn(c, "có phương án dài > 60 ký tự");
    if (q.explanation && q.explanation.length > 300) warn(c, `giải thích dài ${q.explanation.length} ký tự (>300)`);
    if (Number(m?.[3]) >= 200 && !(Array.isArray(q.source) && q.source.length)) warn(c, "mã 2xx thiếu source (URL tham khảo)");
    if (q.source !== undefined && (!Array.isArray(q.source) || q.source.some((u) => !/^https?:\/\/\S+$/.test(u)))) err(c, "source phải là mảng URL");
    if (q.options.some((o) => /tất cả|cả a và b|cả hai/i.test(o))) warn(c, "phương án dạng 'tất cả/cả A và B'");
    if (/\b\d+\.\d+\b/.test([q.content, ...q.options].join(" ")) && q.subject !== "Tiếng Anh" && q.subject !== "Tin học")
      warn(c, "có số thập phân dùng dấu chấm (SGK dùng dấu phẩy)");
  }
  const k = `${q.grade}|${norm(q.content)}`;
  if (contents.has(k)) err(c, `trùng nội dung với ${contents.get(k)}`);
  contents.set(k, c);
}

// Thống kê
const table = {};
for (const q of all) {
  const key = `${q.grade} ${q.level === "basic" ? "CB" : "NC"}`;
  table[key] ??= { total: 0 };
  table[key].total++;
  table[key][q.subject] = (table[key][q.subject] ?? 0) + 1;
}
console.log(`Tổng: ${all.length} câu (cũ ${legacy.length}, mới ${bank.length})`);
console.table(Object.fromEntries(Object.entries(table).sort()));
if (extra.length) {
  const pos = [0, 0, 0, 0];
  extra.forEach((q) => pos[q.answerIndex]++);
  console.log(`File nháp: ${extra.length} câu, đáp án A/B/C/D:`, pos.join(" / "));
}
if (bank.length) {
  const pos = [0, 0, 0, 0];
  bank.forEach((q) => pos[q.answerIndex]++);
  console.log("Phân bố đáp án đúng (kho mới) A/B/C/D:", pos.join(" / "));
}
if (warns.length) console.log(`\n⚠️  ${warns.length} cảnh báo:\n  ` + warns.join("\n  "));
if (errors.length) { console.error(`\n❌ ${errors.length} lỗi:\n  ` + errors.join("\n  ")); process.exit(1); }
console.log("\n✅ Không có lỗi");
