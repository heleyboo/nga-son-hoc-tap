export async function register() {
  // Chỉ chạy trên Node runtime (không chạy ở Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { migrateAndSeed } = await import("./db/migrate");
    migrateAndSeed();
  }
}
