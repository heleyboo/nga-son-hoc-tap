import {
  Atom, BookOpenText, Calculator, Cpu, Globe2, Languages, Scale, Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Grade, Level, Subject } from "./types";

export interface SubjectMeta {
  short: string;
  icon: LucideIcon;
  /** màu chip: nền nhạt + chữ đậm, đạt tương phản AA */
  bg: string;
  fg: string;
  dot: string;
}

export const SUBJECTS: Record<Subject, SubjectMeta> = {
  "Toán": { short: "Toán", icon: Calculator, bg: "#e0f2fe", fg: "#075985", dot: "#0284c7" },
  "Ngữ văn": { short: "Ngữ văn", icon: BookOpenText, bg: "#fce7f3", fg: "#9d174d", dot: "#db2777" },
  "Tiếng Anh": { short: "Tiếng Anh", icon: Languages, bg: "#fef3c7", fg: "#92400e", dot: "#d97706" },
  "KHTN": { short: "KHTN", icon: Atom, bg: "#d1fae5", fg: "#065f46", dot: "#059669" },
  "Lịch sử và Địa lý": { short: "LS & ĐL", icon: Globe2, bg: "#ede9fe", fg: "#5b21b6", dot: "#7c3aed" },
  "GDCD": { short: "GDCD", icon: Scale, bg: "#ffe4e6", fg: "#9f1239", dot: "#e11d48" },
  "Tin học": { short: "Tin học", icon: Cpu, bg: "#cffafe", fg: "#155e75", dot: "#0891b2" },
  "Công nghệ": { short: "Công nghệ", icon: Wrench, bg: "#f1f5f9", fg: "#334155", dot: "#64748b" },
};

export const SUBJECT_ORDER: Subject[] = [
  "Toán", "Ngữ văn", "Tiếng Anh", "KHTN", "Lịch sử và Địa lý", "GDCD", "Tin học", "Công nghệ",
];

/** Mỗi khối một màu nhấn (brief §4: 6 xanh lá, 7 xanh trời, 8 tím, 9 cam) */
export const GRADES: Record<Grade, { name: string; from: string; to: string; soft: string; ink: string; tagline: string }> = {
  6: { name: "KHỐI 6", from: "#059669", to: "#047857", soft: "#d1fae5", ink: "#065f46", tagline: "Khởi động hành trình" },
  7: { name: "KHỐI 7", from: "#0284c7", to: "#075985", soft: "#e0f2fe", ink: "#075985", tagline: "Bứt phá tốc độ" },
  8: { name: "KHỐI 8", from: "#7c3aed", to: "#5b21b6", soft: "#ede9fe", ink: "#5b21b6", tagline: "Chinh phục thử thách" },
  9: { name: "KHỐI 9", from: "#d97706", to: "#9a3412", soft: "#fef3c7", ink: "#92400e", tagline: "Về đích vinh quang" },
};

export const LEVELS: Record<Level, { label: string; hint: string; emoji: string }> = {
  basic: { label: "Cơ bản", hint: "Kiến thức nền, củng cố", emoji: "🌱" },
  advanced: { label: "Nâng cao", hint: "Vận dụng, mở rộng", emoji: "🏆" },
};

export const QUOTES = [
  { text: "Ngọc không mài không sáng, người không học không hiểu lý nghĩa.", by: "Tam tự kinh" },
  { text: "Học, học nữa, học mãi.", by: "V. I. Lê-nin" },
  { text: "Tri thức là chìa khóa mở ra những chân trời mới.", by: "Danh ngôn" },
  { text: "Có công mài sắt, có ngày nên kim.", by: "Tục ngữ Việt Nam" },
  { text: "Học thầy không tày học bạn.", by: "Tục ngữ Việt Nam" },
];

/** Thời gian cho mỗi câu ở chế độ Thi đấu (giây) — dùng chung với server */
export { ARENA_SECONDS } from "@/lib/scoring";
