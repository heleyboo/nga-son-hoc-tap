/**
 * Kiểu dữ liệu dùng chung (client + server) cho chế độ "Lớp học trực tiếp".
 * Server giữ trạng thái phòng; client chỉ nhận "góc nhìn" (view) phù hợp vai trò qua SSE.
 */
export type LivePhase = "lobby" | "question" | "reveal" | "leaderboard" | "ended";

export interface LiveConfig {
  grade: 6 | 7 | 8 | 9;
  level: "basic" | "advanced";
  subjects: string[];
  count: number;
  seconds: number;
}

export interface LiveQuestionView {
  subject: string;
  content: string;
  options: string[];
}

export interface LiveRankRow {
  id: string;
  name: string;
  className: string | null;
  score: number;
  rank: number;
  /** hạng ở lần xếp trước (để hiện mũi tên lên/xuống) */
  prevRank: number | null;
  /** điểm nhận được ở câu vừa rồi */
  gained: number;
  correct: number;
  streak: number;
}

export interface LiveReveal {
  answerIndex: number;
  counts: number[];
  noAnswer: number;
  explanation: string | null;
  /** false = giải thích là bản nháp chưa được giáo viên duyệt */
  explanationReviewed: boolean;
}

export interface HostView {
  role: "host";
  code: string;
  phase: LivePhase;
  config: LiveConfig;
  qIndex: number;
  total: number;
  question: LiveQuestionView | null;
  /** mốc hết giờ (ms, theo đồng hồ server) */
  deadline: number | null;
  serverNow: number;
  answered: number;
  players: { id: string; name: string; className: string | null; online: boolean; score: number }[];
  reveal: LiveReveal | null;
  ranking: LiveRankRow[];
}

export interface PlayerView {
  role: "player";
  code: string;
  phase: LivePhase | "kicked" | "closed";
  /** thời gian mỗi câu (giây) */
  seconds: number;
  qIndex: number;
  total: number;
  question: LiveQuestionView | null;
  deadline: number | null;
  serverNow: number;
  me: { id: string; name: string; score: number; rank: number; of: number; correct: number; streak: number };
  /** lựa chọn của tôi ở câu hiện tại (null = chưa chọn) */
  myChoice: number | null;
  /** chỉ có ở pha reveal/leaderboard/ended */
  result: { answered: boolean; correct: boolean; points: number; answerIndex: number; explanation: string | null; explanationReviewed: boolean } | null;
  podium: { name: string; score: number; rank: number }[];
}

export type LiveView = HostView | PlayerView;

export type HostAction = "start" | "reveal" | "leaderboard" | "next" | "end" | "kick";

export const LIVE_LIMITS = {
  maxPlayers: 120,
  maxRooms: 60,
  nameMax: 24,
  /** phòng không hoạt động quá lâu sẽ bị xoá khỏi bộ nhớ */
  idleMs: 3 * 60 * 60 * 1000,
} as const;
