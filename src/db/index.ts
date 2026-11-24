import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import * as schema from "./schema";

export type DB = BetterSQLite3Database<typeof schema>;

export const DATABASE_PATH = path.resolve(
  /*turbopackIgnore: true*/
  process.env.DATABASE_PATH ?? "./data/app.db",
);

// Giữ 1 kết nối duy nhất, kể cả khi dev server hot-reload module.
const g = globalThis as unknown as { __sqlite?: Database.Database; __db?: DB };

function open(): DB {
  mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
  const sqlite = new Database(DATABASE_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");
  sqlite.pragma("synchronous = NORMAL");
  g.__sqlite = sqlite;
  return drizzle(sqlite, { schema });
}

/**
 * Lấy DB (mở lười ở lần gọi đầu).
 * Lưu ý Next 16 + Cache Components: better-sqlite3 là driver đồng bộ, trong
 * Server Component phải `await connection()` trước khi query để không bị
 * prerender lúc build (xem src/lib/data.ts).
 */
export function getDb(): DB {
  g.__db ??= open();
  return g.__db;
}

export { schema };
