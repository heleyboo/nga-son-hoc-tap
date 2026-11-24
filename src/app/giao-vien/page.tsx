import type { Metadata } from "next";
import { ArenaShell } from "@/features/arena/ArenaShell";
import { TeacherApp } from "@/features/teacher/TeacherApp";

export const metadata: Metadata = { title: "Quản lý giáo viên", robots: { index: false } };

export default function GiaoVienPage() {
  return <ArenaShell><TeacherApp /></ArenaShell>;
}
