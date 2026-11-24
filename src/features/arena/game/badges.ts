import { Crown, Flame, Footprints, Gauge, Layers, Medal, Sparkles, Swords, type LucideIcon } from "lucide-react";
import type { HistoryEntry } from "../data/types";

export interface BadgeDef { id: string; name: string; desc: string; icon: LucideIcon; color: string; test: (h: HistoryEntry, all: HistoryEntry[]) => boolean }

const pct = (h: HistoryEntry) => (h.total ? (h.correct / h.total) * 100 : 0);

/** Huy hiệu được suy ra từ lịch sử — không lưu riêng, nên đồng bộ theo tài khoản */
export const BADGES: BadgeDef[] = [
  { id: "first", name: "Ra mắt đấu trường", desc: "Hoàn thành lượt chơi đầu tiên", icon: Footprints, color: "#0284c7", test: () => true },
  { id: "combo5", name: "Chuỗi lửa", desc: "Đạt chuỗi 5 câu đúng liên tiếp", icon: Flame, color: "#ea580c", test: (h) => h.maxStreak >= 5 },
  { id: "combo10", name: "Bất bại", desc: "Đạt chuỗi 10 câu đúng liên tiếp", icon: Sparkles, color: "#d97706", test: (h) => h.maxStreak >= 10 },
  { id: "perfect", name: "Tuyệt đối", desc: "Đúng 100% một lượt từ 10 câu trở lên", icon: Crown, color: "#d97706", test: (h) => !h.isRetry && h.total >= 10 && h.correct === h.total },
  { id: "arena80", name: "Chiến binh", desc: "Đạt ≥ 80% ở chế độ Thi đấu", icon: Swords, color: "#7c3aed", test: (h) => !h.isRetry && h.mode === "arena" && pct(h) >= 80 },
  { id: "speed", name: "Tia chớp", desc: "Thi đấu: trung bình dưới 6 giây/câu, đúng ≥ 70%", icon: Gauge, color: "#0891b2", test: (h) => h.mode === "arena" && h.total >= 5 && h.durationMs / h.total < 6000 && pct(h) >= 70 },
  { id: "allgrades", name: "Đa năng", desc: "Chơi đủ cả 4 khối 6, 7, 8, 9", icon: Layers, color: "#059669", test: (_, all) => new Set(all.map((x) => x.grade)).size >= 4 },
  { id: "dedicated", name: "Chăm chỉ", desc: "Hoàn thành 10 lượt chơi", icon: Medal, color: "#0369a1", test: (_, all) => all.length >= 10 },
];
export const badgeById = (id: string) => BADGES.find((b) => b.id === id);

export function earnedBadgeIds(history: HistoryEntry[]): Set<string> {
  const got = new Set<string>();
  for (const b of BADGES) if (history.some((h) => b.test(h, history))) got.add(b.id);
  return got;
}
