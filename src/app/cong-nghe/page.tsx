import type { Metadata } from "next";
import { TechApp } from "@/features/tech/TechApp";

export const metadata: Metadata = {
  title: "Bên trong ứng dụng: HTML, CSS, JavaScript và Cơ sở dữ liệu",
  description: "Tìm hiểu 4 công nghệ làm nên một trang web, cùng Git và GitHub, qua ví dụ dễ hiểu và các khu thực hành tự bấm, tự sửa dành cho học sinh THCS.",
};

/** Trang giới thiệu công nghệ nền tảng cho học sinh THCS */
export default function CongNghePage() {
  return <TechApp />;
}
