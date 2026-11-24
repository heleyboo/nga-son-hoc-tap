import type { Metadata } from "next";
import { ArenaApp } from "@/features/arena/ArenaApp";

export const metadata: Metadata = {
  title: "Đấu Trường Tri Thức",
  description: "Sân chơi trắc nghiệm Khối 6–9: luyện tập, thi đấu, combo, huy hiệu và bảng xếp hạng.",
};

/** Toàn bộ trải nghiệm chơi là một ứng dụng client; dữ liệu lấy qua /api/* */
export default function DauTruongPage() {
  return <ArenaApp />;
}
