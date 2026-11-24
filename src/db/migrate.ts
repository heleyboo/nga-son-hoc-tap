import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { and, count, eq, inArray, isNull } from "drizzle-orm";
import path from "node:path";
import { getDb, DATABASE_PATH } from "./index";
import { questions } from "./schema";
import seedQuestions from "./seed/questions.json";
import draftExplanations from "./seed/explanations.draft.json";
import { BANK } from "./seed/bank";
import mathFormat from "./seed/math-format.json";

const MIGRATIONS_DIR = path.resolve(
  /*turbopackIgnore: true*/ process.env.MIGRATIONS_DIR ?? "./drizzle",
);

/** Chạy migration và seed kho câu hỏi nếu DB còn trống. Gọi 1 lần khi server khởi động. */
export function migrateAndSeed() {
  const db = getDb();
  migrate(db, { migrationsFolder: MIGRATIONS_DIR });

  const [{ n }] = db.select({ n: count() }).from(questions).all();
  if (n === 0 && process.env.SEED_ON_START !== "false") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const rows = seedQuestions.map(({ legacyLabel, ...q }) => ({
      ...q,
      level: q.level as "basic" | "advanced",
    }));
    db.transaction((tx) => {
      for (let i = 0; i < rows.length; i += 100) {
        tx.insert(questions).values(rows.slice(i, i + 100)).onConflictDoNothing().run();
      }
    });
    console.log(`[db] Seed ${rows.length} câu hỏi`);
  }
  if (process.env.SEED_ON_START !== "false") seedBank();
  backfillDraftExplanations();
  applyMathFormat();
  console.log(`[db] Sẵn sàng: ${DATABASE_PATH}`);
}

/**
 * Nạp kho câu hỏi mở rộng (src/db/seed/bank/grade-*.json) vào cả DB đã có dữ liệu.
 * Chỉ THÊM câu có mã chưa tồn tại; câu đã có (kể cả đã được GV sửa hoặc ẩn) giữ nguyên.
 * Giải thích là bản nháp soạn tự động → explanation_reviewed = false (“chờ GV duyệt”).
 */
function seedBank() {
  const db = getDb();
  let added = 0;
  db.transaction((tx) => {
    for (let i = 0; i < BANK.length; i += 100) {
      added += tx.insert(questions).values(BANK.slice(i, i + 100)).onConflictDoNothing().run().changes;
    }
  });
  if (added) console.log(`[db] Thêm ${added} câu hỏi mới từ kho mở rộng`);

  // Mã đã bị câu khác chiếm (vd GV tự tạo trước khi có kho mở rộng) → câu trong kho bị bỏ qua.
  const bankContent = new Map(BANK.map((q) => [q.code, q.content]));
  const clashes = db
    .select({ code: questions.code, content: questions.content })
    .from(questions)
    .where(inArray(questions.code, [...bankContent.keys()]))
    .all()
    // nội dung đã được đổi công thức sang LaTeX (math-format.json) vẫn tính là cùng một câu
    .filter((r) => r.content !== bankContent.get(r.code) && r.content !== formattedContent.get(r.code))
    .map((r) => r.code);
  if (clashes.length) {
    console.warn(`[db] ${clashes.length} mã trong kho mở rộng đã bị câu khác dùng, không nạp: ${clashes.join(", ")}`);
  }
}

/**
 * Bổ sung giải thích BẢN NHÁP (soạn tự động) cho câu chưa có giải thích.
 * Chỉ ghi vào ô đang trống, không đè lên giải thích giáo viên đã nhập;
 * explanation_reviewed giữ false để giao diện gắn nhãn “chờ GV duyệt”.
 */
function backfillDraftExplanations() {
  const db = getDb();
  const drafts = draftExplanations as Record<string, { explain?: string; topic?: string }>;
  let n = 0;
  db.transaction((tx) => {
    for (const [code, d] of Object.entries(drafts)) {
      if (d.explain) {
        n += tx.update(questions).set({ explanation: d.explain })
          .where(and(eq(questions.code, code), isNull(questions.explanation))).run().changes;
      }
      if (d.topic) {
        tx.update(questions).set({ topic: d.topic })
          .where(and(eq(questions.code, code), isNull(questions.topic))).run();
      }
    }
  });
  if (n) console.log(`[db] Bổ sung ${n} giải thích bản nháp`);
}

type MathEntry = { code: string; field: string; from: string; to: string };
const formattedContent = new Map((mathFormat as MathEntry[]).filter((e) => e.field === "content").map((e) => [e.code, e.to]));

/**
 * Đổi công thức viết dạng chữ (2^3, 2/3, √x) sang LaTeX \( … \) để hiển thị như sách (KaTeX).
 * Bảng chuyển đổi sinh bởi scripts/math-format.mjs. Chỉ đổi khi nội dung trong DB vẫn đúng y bản gốc
 * → câu giáo viên đã sửa tay (hoặc đã đổi rồi) giữ nguyên; chạy lại nhiều lần không sao.
 */
function applyMathFormat() {
  const db = getDb();
  const entries = mathFormat as MathEntry[];
  const byCode = new Map<string, MathEntry[]>();
  for (const e of entries) byCode.set(e.code, [...(byCode.get(e.code) ?? []), e]);
  let changed = 0;
  db.transaction((tx) => {
    const rows = tx.select({ id: questions.id, code: questions.code, content: questions.content, options: questions.options, explanation: questions.explanation })
      .from(questions).where(inArray(questions.code, [...byCode.keys()])).all();
    for (const r of rows) {
      let content = r.content, explanation = r.explanation, dirty = false;
      const options = [...r.options];
      for (const e of byCode.get(r.code) ?? []) {
        if (e.field === "content" && content === e.from) { content = e.to; dirty = true; }
        else if (e.field === "explanation" && explanation === e.from) { explanation = e.to; dirty = true; }
        else if (e.field.startsWith("options.")) {
          const i = Number(e.field.slice(8));
          if (options[i] === e.from) { options[i] = e.to; dirty = true; }
        }
      }
      if (dirty) { tx.update(questions).set({ content, options, explanation }).where(eq(questions.id, r.id)).run(); changed++; }
    }
  });
  if (changed) console.log(`[db] Hiển thị công thức chuẩn (LaTeX) cho ${changed} câu hỏi`);
}

