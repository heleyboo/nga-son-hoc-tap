import type { Metadata } from "next";
import { ArenaShell } from "@/features/arena/ArenaShell";
import { AssignmentApp } from "@/features/assignment/AssignmentApp";

export const metadata: Metadata = { title: "Bài tập", description: "Làm bài tập thầy cô giao, chấm điểm tự động." };

export default function BaiTapPage() {
  return <ArenaShell><AssignmentApp /></ArenaShell>;
}
