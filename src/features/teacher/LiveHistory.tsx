"use client";
import { ChevronDown, Download, Loader2, Radio } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MathText } from "@/features/arena/components/MathText";
import { useToast } from "@/features/arena/components/Toast";
import { Button, cx } from "@/features/arena/components/ui";
import { api, csvEsc, downloadText, fmtDate } from "./api";

interface Session {
  id: number; code: string; grade: number; level: string; subjects: string[]; questionCount: number; playerCount: number;
  results: { rank: number; name: string; className: string | null; score: number; correct: number }[];
  questionStats: { content: string; subject: string; correctPct: number }[];
  startedAt: string; endedAt: string;
}

export function LiveHistory() {
  const toast = useToast();
  const [items, setItems] = useState<Session[] | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { api<{ items: Session[] }>("/api/teacher/live-sessions").then((r) => setItems(r.items)).catch((e: Error) => toast(e.message, "info")); }, [toast]);

  const exportCsv = (s: Session) => {
    const lines = [["Hạng", "Tên", "Lớp", "Điểm", "Số câu đúng", "Tổng câu"].map(csvEsc).join(",")];
    for (const r of s.results) lines.push([r.rank, r.name, r.className, r.score, r.correct, s.questionCount].map(csvEsc).join(","));
    downloadText(`lop-truc-tiep-${s.code}.csv`, "﻿" + lines.join("\r\n"));
  };

  return (
    <section className="space-y-4">
      <div className="glass p-4 sm:p-5 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <h2 className="font-black text-ink text-lg">Lịch sử lớp học trực tiếp</h2>
          <p className="text-sm text-ink-2">Kết quả được lưu tự động khi một buổi kết thúc.</p>
        </div>
        <Link href="/truc-tiep" className="inline-flex items-center gap-2 min-h-12 px-5 rounded-[var(--radius-ctl)] btn-primary font-extrabold"><Radio className="size-5" aria-hidden /> Mở phòng mới</Link>
      </div>
      {!items ? <Loader2 className="mx-auto size-7 animate-spin text-sky-brand" aria-hidden /> : items.length === 0 ? (
        <p className="glass p-8 text-center text-ink-3 font-semibold">Chưa có buổi nào kết thúc.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((s) => {
            const isOpen = open === s.id;
            const avg = s.questionStats.length ? Math.round(s.questionStats.reduce((a, q) => a + q.correctPct, 0) / s.questionStats.length) : 0;
            return (
              <li key={s.id} className="glass !rounded-2xl">
                <button onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen} className="w-full p-4 flex flex-wrap items-center gap-3 text-left cursor-pointer">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-black text-ink">{fmtDate(s.endedAt)} · Khối {s.grade} {s.level === "basic" ? "Cơ bản" : "Nâng cao"}</p>
                    <p className="text-sm text-ink-2 font-semibold">{s.playerCount} học sinh · {s.questionCount} câu · trung bình {avg}% trả lời đúng · Nhất: {s.results[0]?.name ?? "—"}</p>
                  </div>
                  <ChevronDown className={cx("size-5 text-ink-3 transition", isOpen && "rotate-180")} aria-hidden />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 grid lg:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between"><h3 className="font-bold text-ink">Bảng điểm</h3><Button size="sm" variant="soft" icon={Download} onClick={() => exportCsv(s)}>Tải CSV</Button></div>
                      <ol className="mt-2 max-h-72 overflow-y-auto divide-y divide-sky-100 rounded-2xl border border-sky-100 bg-white/70">
                        {s.results.map((r, i) => (
                          <li key={i} className="flex items-center gap-3 px-3 py-2 text-sm">
                            <span className="w-6 text-center font-black text-ink-3">{r.rank}</span>
                            <span className="flex-1 truncate font-bold text-ink">{r.name}{r.className && <span className="ml-1.5 text-xs text-ink-3">{r.className}</span>}</span>
                            <span className="text-ink-3">{r.correct}/{s.questionCount}</span>
                            <span className="w-14 text-right font-black text-deep tabular-nums">{r.score}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h3 className="font-bold text-ink">Tỉ lệ đúng từng câu</h3>
                      <ol className="mt-2 space-y-2">
                        {s.questionStats.map((q, i) => (
                          <li key={i} className="text-sm">
                            <span className="flex gap-1.5 text-ink"><b className="shrink-0">Câu {i + 1}.</b><MathText text={q.content} className="line-clamp-1" /></span>
                            <span className="mt-1 flex items-center gap-2">
                              <span className="flex-1 h-2 rounded-full bg-sky-100 overflow-hidden"><span className="block h-full bg-sky-brand rounded-full" style={{ width: `${q.correctPct}%` }} /></span>
                              <span className="w-10 text-right font-black tabular-nums">{q.correctPct}%</span>
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
