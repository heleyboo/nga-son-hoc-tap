import type { Metadata } from "next";
import { PlayerApp } from "@/features/live/PlayerApp";
import { LiveShell } from "@/features/live/shared";

export const metadata: Metadata = {
  title: "Vào phòng học",
  description: "Nhập mã phòng để cùng cả lớp trả lời câu hỏi trực tiếp.",
};

export default function ThamGiaPage() {
  return <LiveShell><PlayerApp /></LiveShell>;
}
