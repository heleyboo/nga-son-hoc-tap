// Trích kho câu hỏi từ bản cũ (../web4.html) ra JSON để seed DB.
// Chạy: node scripts/extract-legacy-questions.mjs [đường-dẫn-web4.html]
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const src = process.argv[2] ?? "../web4.html";
const html = readFileSync(src, "utf8");
const start = html.indexOf("const db = {");
const end = html.indexOf("function nav(");
if (start < 0 || end < 0) throw new Error("Không tìm thấy khối `const db` trong " + src);
const legacy = vm.runInNewContext(html.slice(start, end) + "; db");

// Nhãn cũ -> môn theo chương trình GDPT 2018 (Lý/Hóa/Sinh gộp vào KHTN, giữ phân môn ở topic)
function normalize(label) {
  const l = label.toUpperCase();
  const rules = [
    [/^TOÁN/, "Toán"], [/^NGỮ VĂN/, "Ngữ văn"], [/^TIẾNG ANH/, "Tiếng Anh"],
    [/^KHTN/, "KHTN"], [/^VẬT LÝ/, "KHTN", "Vật lý"], [/^HÓA HỌC/, "KHTN", "Hóa học"],
    [/^SINH HỌC/, "KHTN", "Sinh học"], [/^LS-ĐL/, "Lịch sử và Địa lý"],
    [/^TIN HỌC/, "Tin học"], [/^GDCD/, "GDCD"],
  ];
  for (const [re, subject, topic] of rules) if (re.test(l)) return { subject, topic: topic ?? null };
  throw new Error("Nhãn môn chưa có quy tắc: " + label);
}

const out = [];
for (const [grade, levels] of Object.entries(legacy)) {
  for (const [level, items] of Object.entries(levels)) {
    items.forEach((it, i) => {
      const { subject, topic } = normalize(it.s);
      out.push({
        code: `${grade}-${level === "basic" ? "CB" : "NC"}-${String(i + 1).padStart(3, "0")}`,
        grade: Number(grade), level, subject, topic,
        content: it.q, options: it.a, answerIndex: it.c, explanation: null,
        legacyLabel: it.s,
      });
    });
  }
}
writeFileSync("src/db/seed/questions.json", JSON.stringify(out, null, 2) + "\n");
console.log(`Đã ghi ${out.length} câu -> src/db/seed/questions.json`);
