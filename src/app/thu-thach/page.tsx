import type { Metadata } from "next";
import { ArenaShell } from "@/features/arena/ArenaShell";
import { DailyApp } from "@/features/daily/DailyApp";

export const metadata: Metadata = {
  title: "Thử thách mỗi ngày",
  description: "Mỗi ngày 5 câu hỏi, cả trường cùng một đề. Giữ chuỗi ngày liên tiếp và leo bảng xếp hạng.",
};

export default function ThuThachPage() {
  return <ArenaShell><DailyApp /></ArenaShell>;
}
