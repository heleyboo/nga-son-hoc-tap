"use client";
import { BookOpenCheck, ClipboardList, EyeOff, Flag, Loader2, NotebookPen, Radio, Users, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { MathText } from "@/features/arena/components/MathText";
import { cx } from "@/features/arena/components/ui";
import { api } from "./api";

interface OverviewData {
  questions: number; hidden: number; drafts: number; openReports: number; attemptsWeek: number; students: number;
  assignmentsOpen: number; liveSessions: number;
  hardest: { id: number; code: string; subject: string; content: string; total: number; pct: number }[];
}

export function Overview({ onGo }: { onGo: (tab: string) => void }) {
  const [d, setD] = useState<OverviewData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { api<OverviewData>("/api/teacher/overview").then(setD).catch((e: Error) => setErr(e.message)); }, []);
  if (err) return <p role="alert" className="glass p-5 font-bold text-bad">{err}</p>;
  if (!d) return <div className="py-16 grid place-items-center"><Loader2 className="size-7 animate-spin text-sky-brand" aria-hidden /></div>;

  const tiles: { label: string; value: number; icon: LucideIcon; tint: string; tab?: string; warn?: boolean }[] = [
    { label: "Câu hỏi đang dùng", value: d.questions, icon: BookOpenCheck, tint: "#0284c7", tab: "cau-hoi" },
    { label: "Giải thích chờ duyệt", value: d.drafts, icon: NotebookPen, tint: "#b45309", tab: "cau-hoi", warn: d.drafts > 0 },
    { label: "Báo lỗi chưa xử lý", value: d.openReports, icon: Flag, tint: "#dc2626", tab: "bao-loi", warn: d.openReports > 0 },
    { label: "Câu đang ẩn", value: d.hidden, icon: EyeOff, tint: "#64748b", tab: "cau-hoi" },
    { label: "Lượt làm bài 7 ngày", value: d.attemptsWeek, icon: Users, tint: "#059669" },
    { label: "Tài khoản đã đăng nhập", value: d.students, icon: Users, tint: "#7c3aed" },
    { label: "Bài giao đang mở", value: d.assignmentsOpen, icon: ClipboardList, tint: "#0369a1", tab: "bai-giao" },
    { label: "Buổi lớp trực tiếp", value: d.liveSessions, icon: Radio, tint: "#0891b2", tab: "truc-tiep" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          const body = (
            <>
              <span className="grid place-items-center size-10 rounded-2xl shrink-0" style={{ background: `${t.tint}1a`, color: t.tint }}><Icon className="size-5" aria-hidden /></span>
              <span className="min-w-0">
                <span className="block font-black text-2xl text-ink tabular-nums">{t.value.toLocaleString("vi-VN")}</span>
                <span className="block text-sm font-semibold text-ink-2 leading-tight">{t.label}</span>
              </span>
            </>
          );
          const cls = cx("glass !rounded-2xl p-4 flex items-center gap-3 text-left", t.warn && "ring-2 ring-amber-300");
          return t.tab
            ? <button key={t.label} onClick={() => onGo(t.tab!)} className={cx(cls, "hover:shadow-[var(--shadow-lift)] transition cursor-pointer")}>{body}</button>
            : <div key={t.label} className={cls}>{body}</div>;
        })}
      </div>

      <section className="glass p-5 sm:p-6">
        <h2 className="font-black text-ink text-lg">Câu hỏi học sinh hay làm sai</h2>
        <p className="text-sm text-ink-3">Tỉ lệ trả lời đúng thấp nhất (câu có ít nhất 5 lượt trả lời) — nên ôn lại hoặc kiểm tra đáp án.</p>
        {d.hardest.length === 0 ? <p className="mt-4 text-ink-3">Chưa đủ dữ liệu.</p> : (
          <ul className="mt-4 space-y-3">
            {d.hardest.map((q) => (
              <li key={q.id} className="grid sm:grid-cols-[1fr_220px] gap-2 sm:gap-4 items-center">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink-3">{q.code} · {q.subject} · {q.total} lượt</p>
                  <MathText text={q.content} className="block font-semibold text-ink line-clamp-2" />
                </div>
                <div className="flex items-center gap-2" title={`${q.pct}% trả lời đúng`}>
                  <div className="flex-1 h-2.5 rounded-full bg-sky-100 overflow-hidden"><div className="h-full rounded-full bg-sky-brand" style={{ width: `${q.pct}%` }} /></div>
                  <span className="w-12 text-right font-black tabular-nums text-ink">{q.pct}%</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
