/**
 * Công thức tính điểm — DÙNG CHUNG cho client (hiển thị tức thì) và server
 * (chấm chính thức, lưu DB, xếp hạng). Sửa ở đây là đổi cả hai nơi.
 *
 *  Luyện tập: +10 mỗi câu đúng.
 *  Thi đấu:   100 + thưởng tốc độ (≤ 50) + thưởng chuỗi (từ câu đúng thứ 3 liên tiếp, +20/bậc, ≤ 80).
 */
export type ScoreMode = "practice" | "arena";
export type ScoreLevel = "basic" | "advanced";

export const ARENA_SECONDS: Record<ScoreLevel, number> = { basic: 20, advanced: 30 };
export const PRACTICE_POINTS = 10;
/** Thời gian tối thiểu tính thưởng tốc độ — chặn gửi timeMs = 0 để ăn điểm */
const MIN_COUNTED_MS = 1000;

export function scoreAnswer(o: {
  correct: boolean; mode: ScoreMode; level: ScoreLevel; timeMs?: number | null; comboBefore: number;
  /** giới hạn thời gian riêng (vd lớp học trực tiếp); mặc định theo cấp độ */
  limitMs?: number;
}) {
  if (!o.correct) return { points: 0, combo: 0, speedBonus: 0, comboBonus: 0 };
  const combo = o.comboBefore + 1;
  if (o.mode === "practice") return { points: PRACTICE_POINTS, combo, speedBonus: 0, comboBonus: 0 };
  const limit = o.limitMs ?? ARENA_SECONDS[o.level] * 1000;
  const t = o.timeMs == null ? limit : Math.max(MIN_COUNTED_MS, o.timeMs);
  const speedBonus = Math.round(50 * Math.max(0, 1 - t / limit));
  const comboBonus = combo >= 3 ? Math.min(80, (combo - 2) * 20) : 0;
  return { points: 100 + speedBonus + comboBonus, combo, speedBonus, comboBonus };
}

export function scoreRound(answers: { correct: boolean; timeMs?: number | null }[], mode: ScoreMode, level: ScoreLevel) {
  let score = 0, combo = 0, maxStreak = 0;
  for (const a of answers) {
    const s = scoreAnswer({ correct: a.correct, mode, level, timeMs: a.timeMs, comboBefore: combo });
    score += s.points;
    combo = s.combo;
    maxStreak = Math.max(maxStreak, combo);
  }
  return { score, maxStreak };
}
