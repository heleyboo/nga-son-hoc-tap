import type { Metadata } from "next";
import { HostApp } from "@/features/live/HostApp";
import { LiveShell } from "@/features/live/shared";

export const metadata: Metadata = {
  title: "Lớp học trực tiếp",
  description: "Giáo viên mở phòng thi, chiếu câu hỏi lên màn hình, học sinh trả lời bằng điện thoại.",
};

export default function TrucTiepPage() {
  return <LiveShell><HostApp /></LiveShell>;
}
