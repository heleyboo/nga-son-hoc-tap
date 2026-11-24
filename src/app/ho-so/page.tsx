import type { Metadata } from "next";
import { ProfileApp } from "@/features/progress/ProfileApp";

export const metadata: Metadata = {
  title: "Hồ sơ của em",
  description: "Cấp độ, Điểm Tri Thức, chuỗi ngày học, huy hiệu và thành tích trò chơi STEM.",
};

export default function HoSoPage() {
  return <ProfileApp />;
}
