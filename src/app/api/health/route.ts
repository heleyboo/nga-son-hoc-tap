import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";

export async function GET() {
  await connection();
  try {
    getDb().run(sql`select 1`);
    return Response.json({ status: "ok", time: new Date().toISOString() });
  } catch (e) {
    return Response.json({ status: "error", error: String(e) }, { status: 503 });
  }
}
