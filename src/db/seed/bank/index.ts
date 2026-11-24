import type { NewQuestion } from "../../schema";
import g6 from "./grade-6.json";
import g7 from "./grade-7.json";
import g8 from "./grade-8.json";
import g9 from "./grade-9.json";

type BankItem = {
  code: string;
  grade: number;
  level: string;
  subject: string;
  topic?: string | null;
  content: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  /** URL tài liệu tham khảo (chỉ để GV đối chiếu, không nạp vào DB). */
  source?: string[];
};

/**
 * Kho câu hỏi mở rộng theo GDPT 2018 (mã G-CB-1xx / G-NC-1xx).
 * Kiểm tra trước khi commit: `npm run bank:check`.
 * Muốn thêm câu: thêm vào đúng file khối, đặt mã mới chưa dùng.
 * Mã 2xx: câu soạn lại từ nguồn tham khảo trên internet, ghi URL ở trường `source`.
 */
export const BANK: NewQuestion[] = ([g6, g7, g8, g9] as BankItem[][]).flat().map((q) => ({
  code: q.code,
  grade: q.grade,
  level: q.level as NewQuestion["level"],
  subject: q.subject,
  topic: q.topic ?? null,
  content: q.content,
  options: q.options,
  answerIndex: q.answerIndex,
  explanation: q.explanation,
  explanationReviewed: false,
}));
