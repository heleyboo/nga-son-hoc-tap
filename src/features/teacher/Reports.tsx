"use client";
import { Check, Loader2, MessageSquareHeart, Pencil, Star, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MathText } from "@/features/arena/components/MathText";
import { useToast } from "@/features/arena/components/Toast";
import { Button, cx } from "@/features/arena/components/ui";
import { api, fmtDate } from "./api";
import { QuestionEditor, type QRow } from "./QuestionBank";

interface Report {
  id: number; reason: string; note: string | null; status: string; createdAt: string;
  questionId: number; code: string; content: string; subject: string; grade: number;
}
interface Fb {
  id: number; playerName: string | null; grade: number | null; level: string | null; rating: number;
  difficulty: string | null; tags: string[]; comment: string | null; createdAt: string;
}

const REASONS: Record<string, string> = { wrong_answer: "Đáp án sai", unclear: "Đề không rõ", typo: "Lỗi chính tả", other: "Khác" };
const DIFF: Record<string, string> = { easy: "Dễ", medium: "Vừa", hard: "Khó" };

export function Reports() {
  const toast = useToast();
  const [status, setStatus] = useState<"open" | "resolved" | "rejected">("open");
  const [items, setItems] = useState<Report[] | null>(null);
  const [fb, setFb] = useState<Fb[] | null>(null);
  const [editing, setEditing] = useState<QRow | null>(null);

  const load = useCallback(() => {
    api<{ items: Report[] }>(`/api/teacher/reports?status=${status}`).then((r) => setItems(r.items)).catch((e: Error) => toast(e.message, "info"));
  }, [status, toast]);
  useEffect(load, [load]);
  useEffect(() => { api<{ items: Fb[] }>("/api/teacher/feedback").then((r) => setFb(r.items)).catch(() => setFb([])); }, []);

  // gom báo lỗi theo câu hỏi
  const groups = new Map<number, Report[]>();
  for (const r of items ?? []) groups.set(r.questionId, [...(groups.get(r.questionId) ?? []), r]);

  const setAll = async (rs: Report[], to: "resolved" | "rejected" | "open") => {
    try {
      await api("/api/teacher/reports", { method: "PATCH", body: { ids: rs.map((r) => r.id), status: to } });
      toast(to === "resolved" ? "Đã đánh dấu đã sửa" : to === "rejected" ? "Đã bỏ qua báo lỗi" : "Đã mở lại", "ok");
      load();
    } catch (e) { toast((e as Error).message, "info"); }
  };
  const openEditor = async (code: string) => {
    try {
      const r = await api<{ items: QRow[] }>(`/api/teacher/questions?q=${encodeURIComponent(code)}&pageSize=5`);
      const q = r.items.find((x) => x.code === code);
      if (q) setEditing(q); else toast("Không tìm thấy câu hỏi", "info");
    } catch (e) { toast((e as Error).message, "info"); }
  };

  return (
    <div className="grid xl:grid-cols-[1.25fr_1fr] gap-5 items-start">
      <section className="glass p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-black text-ink text-lg">Báo lỗi câu hỏi</h2>
          <div className="flex gap-1 bg-sky-50 rounded-2xl p-1" role="tablist">
            {([["open", "Chưa xử lý"], ["resolved", "Đã sửa"], ["rejected", "Bỏ qua"]] as const).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={status === k} onClick={() => { setStatus(k); setItems(null); }}
                className={cx("min-h-10 px-3 rounded-xl font-bold text-sm cursor-pointer", status === k ? "bg-white text-deep shadow-sm" : "text-ink-2")}>{l}</button>
            ))}
          </div>
        </div>
        {!items ? <Loader2 className="mt-6 mx-auto size-7 animate-spin text-sky-brand" aria-hidden /> : groups.size === 0 ? (
          <p className="mt-6 text-center text-ink-3 font-semibold">Không có báo lỗi nào.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {[...groups.values()].map((rs) => (
              <li key={rs[0].questionId} className="rounded-2xl bg-white/80 border border-sky-100 p-4">
                <p className="text-xs font-bold text-ink-3">{rs[0].code} · Khối {rs[0].grade} · {rs[0].subject}</p>
                <MathText text={rs[0].content} className="mt-1 block font-bold text-ink" />
                <ul className="mt-2 space-y-1">
                  {rs.map((r) => (
                    <li key={r.id} className="text-sm text-ink-2">
                      <span className="pill !py-0.5 !text-xs !bg-red-50 !text-red-700 mr-1.5">{REASONS[r.reason] ?? r.reason}</span>
                      {r.note && <span>“{r.note}”</span>} <span className="text-ink-3 text-xs">· {fmtDate(r.createdAt)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Button size="sm" variant="soft" icon={Pencil} onClick={() => void openEditor(rs[0].code)}>Sửa câu hỏi</Button>
                  {status === "open" ? (<>
                    <Button size="sm" icon={Check} onClick={() => void setAll(rs, "resolved")}>Đã sửa xong</Button>
                    <Button size="sm" variant="ghost" icon={X} onClick={() => void setAll(rs, "rejected")}>Bỏ qua</Button>
                  </>) : <Button size="sm" variant="ghost" onClick={() => void setAll(rs, "open")}>Mở lại</Button>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass p-4 sm:p-5">
        <h2 className="font-black text-ink text-lg inline-flex items-center gap-2"><MessageSquareHeart className="size-5 text-sky-brand" aria-hidden /> Góp ý của học sinh</h2>
        {!fb ? <Loader2 className="mt-6 mx-auto size-7 animate-spin text-sky-brand" aria-hidden /> : fb.length === 0 ? (
          <p className="mt-6 text-center text-ink-3 font-semibold">Chưa có góp ý.</p>
        ) : (
          <ul className="mt-4 space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
            {fb.map((f) => (
              <li key={f.id} className="rounded-2xl bg-white/80 border border-sky-100 p-3.5">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex" aria-label={`${f.rating}/5 sao`}>
                    {Array.from({ length: 5 }, (_, i) => <Star key={i} className={cx("size-4", i < f.rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} aria-hidden />)}
                  </span>
                  <span className="font-bold text-ink">{f.playerName || "Ẩn danh"}</span>
                  {f.grade && <span className="text-ink-3">Khối {f.grade}</span>}
                  {f.difficulty && <span className="pill !py-0.5 !text-xs">{DIFF[f.difficulty] ?? f.difficulty}</span>}
                  <span className="ml-auto text-xs text-ink-3">{fmtDate(f.createdAt)}</span>
                </div>
                {f.tags.length > 0 && <p className="mt-1.5 flex flex-wrap gap-1">{f.tags.map((t) => <span key={t} className="pill !py-0.5 !text-xs !bg-white">{t}</span>)}</p>}
                {f.comment && <p className="mt-1.5 text-ink-2">{f.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <QuestionEditor key={editing?.id ?? "none"} value={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
    </div>
  );
}
