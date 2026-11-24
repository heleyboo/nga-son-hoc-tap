import { connection } from "next/server";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { questions } from "@/db/schema";

/** Số câu hỏi theo khối — dùng ở Server Component. */
export async function getQuestionStats() {
  // better-sqlite3 là driver đồng bộ: phải chờ request để không bị prerender lúc build
  await connection();
  return getDb()
    .select({ grade: questions.grade, total: count() })
    .from(questions)
    .where(eq(questions.isActive, true))
    .groupBy(questions.grade)
    .orderBy(questions.grade)
    .all();
}
