export type Grade = 6 | 7 | 8 | 9;
export type Level = "basic" | "advanced";
export type Mode = "practice" | "arena";

export type Subject =
  | "Toán" | "Ngữ văn" | "Tiếng Anh" | "KHTN" | "Lịch sử và Địa lý" | "GDCD" | "Tin học" | "Công nghệ";

/**
 * Câu trong một lượt. Đáp án KHÔNG được gửi kèm đề: `answer`/`explain` chỉ có
 * sau khi server chấm câu đó (POST /api/questions/:id/check).
 */
export interface RoundQuestion {
  id: string;            // = String(dbId), dùng làm key
  dbId: number;
  code: string;          // vd "6-CB-002"
  grade: Grade;
  level: Level;
  subject: Subject;
  topic: string | null;
  q: string;
  options: string[];     // đã xáo
  optionOrigin: number[]; // chỉ số gốc của từng đáp án đã xáo
  answer?: number;       // chỉ số (đã xáo) của đáp án đúng — có sau khi chấm
  explain?: string | null;
  explainStatus?: "verified" | "draft" | "none";
}

export interface GameConfig {
  grade: Grade;
  level: Level;
  subjects: Subject[]; // rỗng = tất cả
  count: 10 | 20 | 30;
  mode: Mode;
}

export interface AnswerRecord {
  questionId: string;
  selected: number | null; // null = hết giờ
  correct: boolean;
  timeMs: number;
  points: number;
  comboAfter: number;
}

export interface RoundResult {
  id: string;
  date: number;
  player: string;
  className: string;
  config: GameConfig;
  questions: RoundQuestion[];
  answers: AnswerRecord[];
  correct: number;
  total: number;
  score: number;
  maxStreak: number;
  durationMs: number;
  isRetry: boolean;
}

/** Thống kê số câu trong kho: catalog[grade][level][subject] = số câu */
export type Catalog = Partial<Record<Grade, Partial<Record<Level, Partial<Record<Subject, number>>>>>>;

export interface Me { id: string; name: string; nickname: string; className: string | null; image: string | null; isTeacher?: boolean }

export interface HistoryEntry {
  id: string;
  date: number;
  grade: Grade;
  level: Level;
  mode: Mode;
  correct: number;
  total: number;
  score: number;
  maxStreak: number;
  durationMs: number;
  isRetry: boolean;
}
