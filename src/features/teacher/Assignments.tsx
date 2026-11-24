"use client";
import { CalendarClock, Check, ClipboardList, Copy, Download, Loader2, Lock, LockOpen, Plus, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MathText } from "@/features/arena/components/MathText";
import { useToast } from "@/features/arena/components/Toast";
import { Button, cx, Modal, SubjectBadge } from "@/features/arena/components/ui";
import { SUBJECT_ORDER } from "@/features/arena/data/meta";
import type { Catalog, Grade, Level, Subject } from "@/features/arena/data/types";
import { fetchCatalog } from "@/features/arena/lib/api";
import { api, csvEsc, downloadText, fmtDate } from "./api";
import { input } from "./QuestionBank";

interface Row {
  id: number; code: string; title: string; grade: number; level: string; mode: string; is_open: number;
  due_at: number | null; created_at: number; question_count: number; submissions: number; students: number; avg10: number | null;
}
interface Detail {
  assignment: { id: number; code: string; title: string; note: string | null; grade: number; level: string; mode: string; timeLimitMin: number | null; dueAt: string | null; isOpen: boolean };
  submissions: { id: number; playerName: string; className: string | null; correctCount: number; totalQuestions: number; score10: number; durationSec: number; createdAt: string }[];
  latestCount: number;
  stats: { id: number; content: string; subject: string; correctPct: number | null }[];
}

/** Địa chỉ học sinh dùng để mở bài (dùng LIVE_PUBLIC_URL khi giáo viên đang mở bằng localhost) */
function usePublicOrigin() {
  const [pub, setPub] = useState<string | null>(null);
  const local = typeof location !== "undefined" && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  useEffect(() => {
    if (!local) return;
    fetch("/api/live/origin").then((r) => r.json()).then((d: { url: string | null }) => setPub(d.url)).catch(() => {});
  }, [local]);
  return local && pub ? pub : typeof location !== "undefined" ? location.origin : "";
}

export function Assignments() {
  const toast = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const origin = usePublicOrigin();
  const [now] = useState(() => Date.now());

  const load = useCallback(() => {
    api<{ items: Row[] }>("/api/teacher/assignments").then((r) => setRows(r.items)).catch((e: Error) => toast(e.message, "info"));
  }, [toast]);
  useEffect(load, [load]);

  return (
    <section className="space-y-4">
      <div className="glass p-4 sm:p-5 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <h2 className="font-black text-ink text-lg">Bài giao</h2>
          <p className="text-sm text-ink-2">Tạo một đề cố định, gửi đường dẫn hoặc mã cho học sinh làm ở nhà. Chấm điểm thang 10 tự động.</p>
        </div>
        <Button icon={Plus} onClick={() => setCreating(true)}>Tạo bài giao</Button>
      </div>

      {!rows ? <Loader2 className="mx-auto size-7 animate-spin text-sky-brand" aria-hidden /> : rows.length === 0 ? (
        <div className="glass p-8 text-center text-ink-3 font-semibold"><ClipboardList className="size-10 mx-auto mb-2" aria-hidden />Chưa có bài giao nào.</div>
      ) : (
        <ul className="grid md:grid-cols-2 gap-3">
          {rows.map((r) => {
            const overdue = r.due_at !== null && r.due_at * 1000 < now;
            const open = !!r.is_open && !overdue;
            return (
              <li key={r.id}>
                <button onClick={() => setOpenId(r.id)} className="glass !rounded-2xl p-4 w-full text-left hover:shadow-[var(--shadow-lift)] transition cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-ink truncate">{r.title}</p>
                      <p className="text-xs font-bold text-ink-3">Mã <span className="tracking-widest text-deep">{r.code}</span> · Khối {r.grade} · {r.level === "basic" ? "Cơ bản" : "Nâng cao"} · {r.question_count} câu · {r.mode === "test" ? "Kiểm tra" : "Luyện tập"}</p>
                    </div>
                    <span className={cx("pill !py-0.5 !text-xs shrink-0", open ? "!bg-emerald-50 !text-emerald-800" : "!bg-slate-100 !text-slate-600")}>{open ? "Đang mở" : overdue && r.is_open ? "Hết hạn" : "Đã đóng"}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2 font-semibold">
                    <span className="inline-flex items-center gap-1"><Users className="size-4" aria-hidden /> {r.students} học sinh · {r.submissions} lượt nộp</span>
                    <span>Điểm TB: <b className="text-deep">{r.avg10 !== null ? r.avg10.toLocaleString("vi-VN") : "—"}</b></span>
                    {r.due_at && <span className="inline-flex items-center gap-1"><CalendarClock className="size-4" aria-hidden /> Hạn {fmtDate(r.due_at)}</span>}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <CreateDialog open={creating} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); load(); setOpenId(id); }} />
      <DetailDialog key={openId ?? "none"} id={openId} origin={origin} onClose={() => setOpenId(null)} onChanged={load} />
    </section>
  );
}

function CreateDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (id: number) => void }) {
  const toast = useToast();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [d, setD] = useState({ title: "", note: "", grade: 7 as Grade, level: "basic" as Level, subjects: [] as Subject[], count: 10, mode: "test", timeLimitMin: "", due: "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open && !catalog) fetchCatalog().then(setCatalog).catch(() => {}); }, [open, catalog]);
  const avail = catalog?.[d.grade]?.[d.level] ?? {};
  const pool = (d.subjects.length ? d.subjects : (Object.keys(avail) as Subject[])).reduce((n, s) => n + (avail[s] ?? 0), 0);
  const lbl = "block text-sm font-bold text-ink-2 mb-1";
  const sel = cx(input, "cursor-pointer");

  const create = async () => {
    setBusy(true);
    try {
      const r = await api<{ id: number }>("/api/teacher/assignments", { body: {
        title: d.title, note: d.note || null, grade: d.grade, level: d.level, subjects: d.subjects, count: d.count, mode: d.mode,
        timeLimitMin: d.timeLimitMin ? Number(d.timeLimitMin) : null, dueAt: d.due ? Math.floor(new Date(d.due).getTime() / 1000) * 1000 : null,
      } });
      toast("Đã tạo bài giao", "ok");
      setD({ ...d, title: "", note: "" });
      onCreated(r.id);
    } catch (e) { toast((e as Error).message, "info"); }
    finally { setBusy(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo bài giao" wide>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void create(); }}>
        <label className="block"><span className={lbl}>Tên bài</span><input required minLength={2} className={input} value={d.title} placeholder="VD: Ôn tập chương 2 – Toán 7" onChange={(e) => setD({ ...d, title: e.target.value })} /></label>
        <label className="block"><span className={lbl}>Lời dặn (không bắt buộc)</span><textarea rows={2} className={cx(input, "py-2")} value={d.note} onChange={(e) => setD({ ...d, note: e.target.value })} /></label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label><span className={lbl}>Khối</span><select className={sel} value={d.grade} onChange={(e) => setD({ ...d, grade: Number(e.target.value) as Grade, subjects: [] })}>{[6, 7, 8, 9].map((g) => <option key={g} value={g}>Khối {g}</option>)}</select></label>
          <label><span className={lbl}>Cấp độ</span><select className={sel} value={d.level} onChange={(e) => setD({ ...d, level: e.target.value as Level, subjects: [] })}><option value="basic">Cơ bản</option><option value="advanced">Nâng cao</option></select></label>
          <label><span className={lbl}>Số câu</span><input type="number" min={3} max={40} className={input} value={d.count} onChange={(e) => setD({ ...d, count: Number(e.target.value) })} /></label>
          <label><span className={lbl}>Hình thức</span><select className={sel} value={d.mode} onChange={(e) => setD({ ...d, mode: e.target.value })}><option value="test">Kiểm tra (xem đáp án khi nộp)</option><option value="practice">Luyện tập (đáp án sau mỗi câu)</option></select></label>
        </div>
        <fieldset>
          <legend className={lbl}>Môn (bỏ trống = trộn tất cả)</legend>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_ORDER.filter((s) => avail[s]).map((s) => (
              <button key={s} type="button" aria-pressed={d.subjects.includes(s)} onClick={() => setD({ ...d, subjects: d.subjects.includes(s) ? d.subjects.filter((x) => x !== s) : [...d.subjects, s] })}
                className={cx("rounded-full p-0.5 border-2 cursor-pointer", d.subjects.includes(s) ? "border-sky-brand" : "border-transparent opacity-80")}>
                <SubjectBadge subject={s} />
              </button>
            ))}
          </div>
          {catalog && <p className="mt-1 text-xs text-ink-3">Kho có {pool} câu phù hợp{pool < d.count ? ` — bài sẽ có ${pool} câu` : ""}.</p>}
        </fieldset>
        <div className="grid sm:grid-cols-2 gap-3">
          <label><span className={lbl}>Giới hạn thời gian (phút, để trống = không giới hạn)</span><input type="number" min={1} max={180} className={input} value={d.timeLimitMin} onChange={(e) => setD({ ...d, timeLimitMin: e.target.value })} /></label>
          <label><span className={lbl}>Hạn nộp (không bắt buộc)</span><input type="datetime-local" className={input} value={d.due} onChange={(e) => setD({ ...d, due: e.target.value })} /></label>
        </div>
        <div className="modal-actions">
          <Button type="button" variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button type="submit" icon={busy ? Loader2 : Check} disabled={busy || pool === 0}>Tạo bài</Button>
        </div>
      </form>
    </Modal>
  );
}

function DetailDialog({ id, origin, onClose, onChanged }: { id: number | null; origin: string; onClose: () => void; onChanged: () => void }) {
  const toast = useToast();
  const [d, setD] = useState<Detail | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const load = useCallback(() => {
    if (id === null) return;
    api<Detail>(`/api/teacher/assignments/${id}`).then(setD).catch((e: Error) => toast(e.message, "info"));
  }, [id, toast]);
  useEffect(load, [load]);

  const a = d?.assignment;
  const url = a ? `${origin}/bai-tap?ma=${a.code}` : "";
  const patch = async (body: object, msg: string) => {
    try { await api(`/api/teacher/assignments/${id}`, { method: "PATCH", body }); toast(msg, "ok"); load(); onChanged(); }
    catch (e) { toast((e as Error).message, "info"); }
  };
  const del = async () => {
    try { await api(`/api/teacher/assignments/${id}`, { method: "DELETE" }); toast("Đã xoá bài giao", "ok"); onChanged(); onClose(); }
    catch (e) { toast((e as Error).message, "info"); }
  };
  const exportCsv = () => {
    if (!d) return;
    const lines = [["Tên", "Lớp", "Điểm (thang 10)", "Số câu đúng", "Tổng câu", "Thời gian làm (phút)", "Nộp lúc"].map(csvEsc).join(",")];
    for (const s of d.submissions) lines.push([s.playerName, s.className, s.score10.toString().replace(".", ","), s.correctCount, s.totalQuestions, Math.round(s.durationSec / 6) / 10, fmtDate(s.createdAt)].map(csvEsc).join(","));
    downloadText(`bai-giao-${d.assignment.code}.csv`, "﻿" + lines.join("\r\n"));
  };

  return (
    <Modal open={id !== null} onClose={onClose} title={a?.title ?? "Bài giao"} wide>
      {!d || !a ? <Loader2 className="mx-auto size-7 animate-spin text-sky-brand" aria-hidden /> : (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-[150px_1fr] gap-4 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/live/qr?url=${encodeURIComponent(url)}`} alt={`Mã QR mở bài ${a.code}`} className="size-[150px] rounded-2xl bg-white p-2 border border-sky-100" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-3">Mã bài</p>
              <p className="font-black text-4xl tracking-[.2em] text-deep">{a.code}</p>
              <p className="mt-1 text-sm text-ink-2 break-all">{url}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Button size="sm" variant="soft" icon={Copy} onClick={() => void navigator.clipboard?.writeText(url).then(() => toast("Đã chép đường dẫn", "ok"))}>Chép đường dẫn</Button>
                <Button size="sm" variant="soft" icon={a.isOpen ? Lock : LockOpen} onClick={() => void patch({ isOpen: !a.isOpen }, a.isOpen ? "Đã đóng bài" : "Đã mở lại bài")}>{a.isOpen ? "Đóng bài" : "Mở lại"}</Button>
                {confirmDel
                  ? <Button size="sm" variant="danger" icon={Trash2} onClick={() => void del()}>Xoá hẳn (kèm {d.submissions.length} bài nộp)?</Button>
                  : <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setConfirmDel(true)}>Xoá</Button>}
              </div>
            </div>
          </div>
          <p className="text-sm text-ink-2">
            Khối {a.grade} · {a.level === "basic" ? "Cơ bản" : "Nâng cao"} · {a.mode === "test" ? "Kiểm tra" : "Luyện tập"}
            {a.timeLimitMin ? ` · ${a.timeLimitMin} phút` : ""} · Hạn nộp: {a.dueAt ? fmtDate(a.dueAt) : "không"}
            {a.note && <><br />Lời dặn: {a.note}</>}
          </p>

          <section>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-black text-ink">Bài nộp ({d.latestCount} học sinh, {d.submissions.length} lượt)</h3>
              {d.submissions.length > 0 && <Button size="sm" variant="soft" icon={Download} onClick={exportCsv}>Tải CSV</Button>}
            </div>
            {d.submissions.length === 0 ? <p className="mt-2 text-ink-3">Chưa có học sinh nộp bài.</p> : (
              <div className="mt-2 max-h-72 overflow-auto rounded-2xl border border-sky-100">
                <table className="w-full text-sm">
                  <thead className="bg-sky-50 text-ink-2 sticky top-0"><tr>
                    <th className="text-left p-2.5">Tên</th><th className="text-left p-2.5">Lớp</th><th className="text-right p-2.5">Điểm</th>
                    <th className="text-right p-2.5">Đúng</th><th className="text-right p-2.5 max-sm:hidden">Thời gian</th><th className="text-right p-2.5">Nộp lúc</th>
                  </tr></thead>
                  <tbody>
                    {d.submissions.map((s) => (
                      <tr key={s.id} className="border-t border-sky-100">
                        <td className="p-2.5 font-bold text-ink">{s.playerName}</td><td className="p-2.5 text-ink-2">{s.className ?? ""}</td>
                        <td className={cx("p-2.5 text-right font-black tabular-nums", s.score10 >= 8 ? "text-ok" : s.score10 >= 5 ? "text-deep" : "text-bad")}>{s.score10.toLocaleString("vi-VN")}</td>
                        <td className="p-2.5 text-right tabular-nums">{s.correctCount}/{s.totalQuestions}</td>
                        <td className="p-2.5 text-right tabular-nums max-sm:hidden">{Math.floor(s.durationSec / 60)}:{String(s.durationSec % 60).padStart(2, "0")}</td>
                        <td className="p-2.5 text-right text-ink-3 whitespace-nowrap">{fmtDate(s.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h3 className="font-black text-ink">Tỉ lệ đúng từng câu</h3>
            <p className="text-xs text-ink-3">Tính trên lần nộp gần nhất của mỗi học sinh.</p>
            <ol className="mt-2 space-y-2">
              {d.stats.map((q, i) => (
                <li key={q.id} className="grid sm:grid-cols-[1fr_200px] gap-2 items-center">
                  <span className="min-w-0 text-sm text-ink flex gap-1.5"><b className="shrink-0">Câu {i + 1}.</b><MathText text={q.content} className="line-clamp-2" /></span>
                  <span className="flex items-center gap-2">
                    <span className="flex-1 h-2.5 rounded-full bg-sky-100 overflow-hidden"><span className="block h-full rounded-full bg-sky-brand" style={{ width: `${q.correctPct ?? 0}%` }} /></span>
                    <span className="w-11 text-right font-black tabular-nums text-sm">{q.correctPct === null ? "—" : `${q.correctPct}%`}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </Modal>
  );
}
