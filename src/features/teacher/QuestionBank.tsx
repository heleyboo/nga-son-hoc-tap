"use client";
import {
  Check, ChevronLeft, ChevronRight, Download, Eye, EyeOff, FileUp, Flag, Loader2, Pencil, Plus, Search, Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MathToolbar, type FieldTarget } from "./MathToolbar";
import { MathText } from "@/features/arena/components/MathText";
import { useToast } from "@/features/arena/components/Toast";
import { Button, cx, Modal, SubjectBadge } from "@/features/arena/components/ui";
import { SUBJECT_ORDER } from "@/features/arena/data/meta";
import type { Subject } from "@/features/arena/data/types";
import { api, downloadText } from "./api";

export interface QRow {
  id: number; code: string; grade: number; level: "basic" | "advanced"; subject: string; topic: string | null;
  content: string; options: string[]; answerIndex: number; explanation: string | null;
  explanationReviewed: boolean; isActive: boolean; openReports: number;
}
interface Filter { grade: string; level: string; subject: string; status: string; q: string }

const LETTERS = "ABCDEF";
export const input = "w-full px-3 min-h-11 rounded-xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none font-semibold text-ink";
const select = "px-3 min-h-11 rounded-xl bg-white border-2 border-sky-100 focus:border-sky-brand outline-none font-semibold text-ink cursor-pointer";

const qs = (f: Filter, extra: Record<string, string> = {}) => {
  const p = new URLSearchParams(extra);
  for (const [k, v] of Object.entries(f)) if (v && v !== "all") p.set(k, v);
  return p.toString();
};

export function QuestionBank() {
  const toast = useToast();
  const [f, setF] = useState<Filter>({ grade: "", level: "", subject: "", status: "all", q: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ver, setVer] = useState(0);
  const [res, setRes] = useState<{ key: string; data: { total: number; items: QRow[] } } | null>(null);
  const [editing, setEditing] = useState<QRow | "new" | null>(null);
  const [importing, setImporting] = useState(false);
  const pageSize = 20;

  const query = qs(f, { page: String(page), pageSize: String(pageSize) });
  const key = `${query}#${ver}`;
  useEffect(() => {
    let alive = true;
    api<{ total: number; items: QRow[] }>(`/api/teacher/questions?${query}`)
      .then((data) => { if (alive) setRes({ key, data }); })
      .catch((e: Error) => toast(e.message, "info"));
    return () => { alive = false; };
  }, [query, key, toast]);
  const load = useCallback(() => setVer((v) => v + 1), []);
  const data = res?.data ?? null;
  const loading = res?.key !== key;

  // gõ tìm kiếm: chờ 300ms rồi mới lọc
  useEffect(() => {
    const t = setTimeout(() => { setF((cur) => (cur.q === search ? cur : { ...cur, q: search })); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const set = (k: keyof Filter) => (e: React.ChangeEvent<HTMLSelectElement>) => { setF({ ...f, [k]: e.target.value }); setPage(1); };
  const patch = async (q: QRow, body: Partial<Pick<QRow, "isActive" | "explanationReviewed">>, msg: string) => {
    try { await api(`/api/teacher/questions/${q.id}`, { method: "PATCH", body }); toast(msg, "ok"); load(); }
    catch (e) { toast((e as Error).message, "info"); }
  };
  const pages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <section className="space-y-4">
      <div className="glass p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative flex-1 min-w-[220px]">
            <span className="sr-only">Tìm câu hỏi</span>
            <Search className="size-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo nội dung, mã, chủ đề…" className={cx(input, "pl-9")} />
          </label>
          <select aria-label="Khối" value={f.grade} onChange={set("grade")} className={select}>
            <option value="">Mọi khối</option>{[6, 7, 8, 9].map((g) => <option key={g} value={g}>Khối {g}</option>)}
          </select>
          <select aria-label="Cấp độ" value={f.level} onChange={set("level")} className={select}>
            <option value="">Mọi cấp độ</option><option value="basic">Cơ bản</option><option value="advanced">Nâng cao</option>
          </select>
          <select aria-label="Môn" value={f.subject} onChange={set("subject")} className={select}>
            <option value="">Mọi môn</option>{SUBJECT_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select aria-label="Trạng thái" value={f.status} onChange={set("status")} className={select}>
            <option value="all">Tất cả</option><option value="active">Đang dùng</option><option value="hidden">Đang ẩn</option>
            <option value="draft">Giải thích chờ duyệt</option><option value="reported">Bị báo lỗi</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="sm" icon={Plus} onClick={() => setEditing("new")}>Thêm câu hỏi</Button>
          <Button size="sm" variant="soft" icon={FileUp} onClick={() => setImporting(true)}>Nhập từ CSV/Excel</Button>
          <a href={`/api/teacher/questions/export?${qs(f)}`} className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-[14px] font-extrabold text-[var(--fs-small)] bg-white/90 text-deep border border-sky-100 hover:bg-white">
            <Download className="size-4" aria-hidden /> Xuất CSV
          </a>
          <span className="ml-auto text-sm font-semibold text-ink-3">{data ? `${data.total.toLocaleString("vi-VN")} câu` : ""}</span>
        </div>
      </div>

      <div className="glass p-2 sm:p-3 relative min-h-40">
        {loading && <div className="absolute inset-0 grid place-items-center bg-white/40 z-10 rounded-[inherit]"><Loader2 className="size-7 animate-spin text-sky-brand" aria-hidden /></div>}
        {data && data.items.length === 0 && !loading && <p className="p-6 text-center text-ink-3 font-semibold">Không có câu hỏi phù hợp bộ lọc.</p>}
        <ul className="divide-y divide-sky-100">
          {data?.items.map((q) => (
            <li key={q.id} className={cx("p-3 sm:p-4 grid gap-3 md:grid-cols-[1fr_auto] items-start", !q.isActive && "opacity-60")}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  <span className="text-ink-3">{q.code}</span>
                  <span className="pill !py-0.5 !text-xs">Khối {q.grade} · {q.level === "basic" ? "Cơ bản" : "Nâng cao"}</span>
                  {SUBJECT_ORDER.includes(q.subject as Subject) ? <SubjectBadge subject={q.subject as Subject} size="sm" /> : <span className="pill !py-0.5 !text-xs">{q.subject}</span>}
                  {q.topic && <span className="text-ink-3">· {q.topic}</span>}
                  {!q.isActive && <span className="pill !py-0.5 !text-xs !bg-slate-100 !text-slate-600">Đang ẩn</span>}
                  {q.explanation && !q.explanationReviewed && <span className="pill !py-0.5 !text-xs !bg-amber-50 !text-amber-800">Giải thích nháp</span>}
                  {q.openReports > 0 && <span className="pill !py-0.5 !text-xs !bg-red-50 !text-red-700"><Flag className="size-3" aria-hidden /> {q.openReports} báo lỗi</span>}
                </div>
                <MathText text={q.content} className="mt-1.5 block font-bold text-ink" />
                <ol className="mt-1.5 grid sm:grid-cols-2 gap-x-4 gap-y-0.5 text-sm">
                  {q.options.map((o, i) => (
                    <li key={i} className={cx("flex gap-1.5", i === q.answerIndex ? "text-ok font-bold" : "text-ink-2")}>
                      <span className="w-4 shrink-0">{LETTERS[i]}.</span><MathText text={o} />{i === q.answerIndex && <Check className="size-4 shrink-0 mt-0.5" aria-label="Đáp án đúng" />}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex md:flex-col gap-1.5 md:items-stretch">
                <Button size="sm" variant="soft" icon={Pencil} onClick={() => setEditing(q)}>Sửa</Button>
                {q.explanation && !q.explanationReviewed && (
                  <Button size="sm" variant="soft" icon={Check} onClick={() => void patch(q, { explanationReviewed: true }, "Đã duyệt giải thích")}>Duyệt giải thích</Button>
                )}
                <Button size="sm" variant="ghost" icon={q.isActive ? EyeOff : Eye}
                  onClick={() => void patch(q, { isActive: !q.isActive }, q.isActive ? "Đã ẩn câu hỏi" : "Đã hiện lại câu hỏi")}>
                  {q.isActive ? "Ẩn" : "Hiện"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 p-3">
            <Button size="sm" variant="soft" icon={ChevronLeft} disabled={page <= 1} onClick={() => setPage(page - 1)}>Trước</Button>
            <span className="font-bold text-ink-2 tabular-nums">Trang {page}/{pages}</span>
            <Button size="sm" variant="soft" iconRight={ChevronRight} disabled={page >= pages} onClick={() => setPage(page + 1)}>Sau</Button>
          </div>
        )}
      </div>

      <QuestionEditor key={editing === "new" ? "new" : editing?.id ?? "none"} value={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      <ImportDialog open={importing} onClose={() => setImporting(false)} onDone={() => { setImporting(false); load(); }} />
    </section>
  );
}

/* ---------------- Sửa / thêm câu hỏi ---------------- */
export function QuestionEditor({ value, onClose, onSaved }: { value: QRow | "new" | null; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const init = value && value !== "new" ? value : null;
  const [d, setD] = useState({
    code: init?.code ?? "", grade: init?.grade ?? 7, level: init?.level ?? "basic", subject: init?.subject ?? "Toán",
    topic: init?.topic ?? "", content: init?.content ?? "", options: init?.options ?? ["", "", "", ""], answerIndex: init?.answerIndex ?? 0,
    explanation: init?.explanation ?? "", explanationReviewed: init ? init.explanationReviewed || !init.explanation : true, isActive: init?.isActive ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  // ô đang soạn — hàng nút công thức chèn vào đúng chỗ con trỏ của ô này
  const field = useRef<FieldTarget>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const onFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.currentTarget.dataset.field ?? "content";
    const set = (v: string) => setD((x) => key === "content" ? { ...x, content: v } : key === "explanation" ? { ...x, explanation: v }
      : { ...x, options: x.options.map((o, j) => (`opt-${j}` === key ? v : o)) });
    field.current = { el: e.currentTarget, set };
  };
  const hasMath = [d.content, d.explanation, ...d.options].some((x) => /\\[([]/.test(x ?? ""));

  const save = async () => {
    setBusy(true);
    try {
      const body = { ...d, options: d.options.map((o) => o.trim()).filter(Boolean), code: d.code || null, topic: d.topic || null, explanation: d.explanation || null };
      if (init) await api(`/api/teacher/questions/${init.id}`, { method: "PUT", body });
      else await api("/api/teacher/questions", { body });
      toast(init ? "Đã lưu câu hỏi" : "Đã thêm câu hỏi", "ok");
      onSaved();
    } catch (e) { toast((e as Error).message, "info"); setBusy(false); }
  };
  const setOpt = (i: number, v: string) => setD({ ...d, options: d.options.map((o, j) => (j === i ? v : o)) });
  const removeOpt = (i: number) => setD({ ...d, options: d.options.filter((_, j) => j !== i), answerIndex: d.answerIndex === i ? 0 : d.answerIndex > i ? d.answerIndex - 1 : d.answerIndex });
  const lbl = "block text-sm font-bold text-ink-2 mb-1";

  return (
    <Modal open={value !== null} onClose={onClose} title={init ? `Sửa câu ${init.code}` : "Thêm câu hỏi"} wide>
      <form onSubmit={(e) => { e.preventDefault(); void save(); }} className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label><span className={lbl}>Khối</span>
            <select className={cx(select, "w-full")} value={d.grade} onChange={(e) => setD({ ...d, grade: Number(e.target.value) })}>{[6, 7, 8, 9].map((g) => <option key={g} value={g}>Khối {g}</option>)}</select></label>
          <label><span className={lbl}>Cấp độ</span>
            <select className={cx(select, "w-full")} value={d.level} onChange={(e) => setD({ ...d, level: e.target.value as "basic" | "advanced" })}><option value="basic">Cơ bản</option><option value="advanced">Nâng cao</option></select></label>
          <label><span className={lbl}>Môn</span>
            <select className={cx(select, "w-full")} value={d.subject} onChange={(e) => setD({ ...d, subject: e.target.value })}>{SUBJECT_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
          <label><span className={lbl}>Mã {init ? "" : "(tự sinh)"}</span>
            <input className={input} value={d.code} placeholder="vd 7-CB-031" onChange={(e) => setD({ ...d, code: e.target.value })} /></label>
        </div>
        <label className="block"><span className={lbl}>Chủ đề (không bắt buộc)</span><input className={input} value={d.topic} onChange={(e) => setD({ ...d, topic: e.target.value })} /></label>
        <div className="sticky -top-5 sm:-top-7 z-10 -mx-1 px-1 py-2 bg-white/95 backdrop-blur rounded-xl">
          <MathToolbar target={field} fallback={() => (contentRef.current ? { el: contentRef.current, set: (v) => setD((x) => ({ ...x, content: v })) } : null)} />
          <p className="mt-1 text-xs text-ink-3">Bấm vào ô cần gõ rồi bấm nút để chèn công thức (phân số, căn, mũ…). Công thức nằm trong <code>\( … \)</code>, xem trước ngay bên dưới.</p>
        </div>
        <label className="block"><span className={lbl}>Nội dung câu hỏi</span>
          <textarea ref={contentRef} required rows={3} className={cx(input, "py-2")} value={d.content}
            onChange={(e) => setD({ ...d, content: e.target.value })} data-field="content" onFocus={onFieldFocus} />
        </label>

        <fieldset>
          <legend className={lbl}>Các đáp án — chọn ô tròn ở đáp án đúng</legend>
          <div className="space-y-2">
            {d.options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <label className={cx("grid place-items-center size-11 rounded-xl border-2 font-black cursor-pointer shrink-0", d.answerIndex === i ? "bg-ok text-white border-ok" : "bg-white border-sky-100 text-ink-2")}>
                  <input type="radio" name="answer" className="sr-only" checked={d.answerIndex === i} onChange={() => setD({ ...d, answerIndex: i })} aria-label={`Đáp án đúng là ${LETTERS[i]}`} />
                  {LETTERS[i]}
                </label>
                <input className={input} value={o} required={i < 2} onChange={(e) => setOpt(i, e.target.value)} placeholder={`Đáp án ${LETTERS[i]}`} data-field={`opt-${i}`} onFocus={onFieldFocus} />
                {d.options.length > 2 && (
                  <button type="button" onClick={() => removeOpt(i)} aria-label={`Xoá đáp án ${LETTERS[i]}`} className="grid place-items-center size-11 rounded-xl text-ink-3 hover:bg-red-50 hover:text-bad cursor-pointer shrink-0"><Trash2 className="size-4.5" aria-hidden /></button>
                )}
              </div>
            ))}
          </div>
          {d.options.length < 6 && <Button type="button" size="sm" variant="ghost" icon={Plus} className="mt-2" onClick={() => setD({ ...d, options: [...d.options, ""] })}>Thêm đáp án</Button>}
        </fieldset>

        <label className="block"><span className={lbl}>Giải thích (hiện sau khi trả lời)</span>
          <textarea rows={3} className={cx(input, "py-2")} value={d.explanation} onChange={(e) => setD({ ...d, explanation: e.target.value })} data-field="explanation" onFocus={onFieldFocus} /></label>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <label className="inline-flex items-center gap-2 font-semibold text-ink cursor-pointer"><input type="checkbox" className="size-5 accent-sky-600" checked={d.explanationReviewed} onChange={(e) => setD({ ...d, explanationReviewed: e.target.checked })} /> Giải thích đã được duyệt</label>
          <label className="inline-flex items-center gap-2 font-semibold text-ink cursor-pointer"><input type="checkbox" className="size-5 accent-sky-600" checked={d.isActive} onChange={(e) => setD({ ...d, isActive: e.target.checked })} /> Đang dùng (hiện cho học sinh)</label>
        </div>

        <div>
          <button type="button" onClick={() => setPreview((p) => !p)} className="text-sm font-bold text-deep cursor-pointer">{preview || hasMath ? "Xem trước như học sinh thấy:" : "Xem trước như học sinh thấy"}</button>
          {(preview || hasMath) && (
            <div className="mt-2 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
              <MathText text={d.content || "…"} className="block font-bold text-ink" />
              <ul className="mt-2 space-y-1">{d.options.filter(Boolean).map((o, i) => <li key={i} className={cx(i === d.answerIndex ? "text-ok font-bold" : "text-ink-2")}><b>{LETTERS[i]}.</b> <MathText text={o} /></li>)}</ul>
              {d.explanation && <p className="mt-2 text-sm text-ink-2"><b>Giải thích: </b><MathText text={d.explanation} /></p>}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <Button type="button" variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button type="submit" icon={busy ? Loader2 : Check} disabled={busy}>{init ? "Lưu thay đổi" : "Thêm câu hỏi"}</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------------- Nhập CSV ---------------- */
const TEMPLATE = "﻿ma,khoi,cap_do,mon,chu_de,cau_hoi,a,b,c,d,dap_an,giai_thich,da_duyet,hien\r\n"
  + `,7,co-ban,Toán,Số hữu tỉ,"Kết quả của phép tính 1/2 + 1/3 là?",5/6,2/5,1/6,2/6,A,"Quy đồng: 3/6 + 2/6 = 5/6.",1,1\r\n`
  + `,8,co-ban,Toán,Lũy thừa,"Giá trị của 2^3 + 3^2 là?",17,12,13,15,A,"2^3 = 8 và 3^2 = 9, tổng là 17.",1,1\r\n`
  + `,8,nang-cao,KHTN,,"Đơn vị đo cường độ dòng điện là gì?",Vôn (V),Ampe (A),Ôm (Ω),Oát (W),B,,1,1\r\n`;

function ImportDialog({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const [csv, setCsv] = useState<{ name: string; text: string } | null>(null);
  const [check, setCheck] = useState<{ created: number; updated: number; errors: { line: number; message: string }[] } | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    setCsv({ name: file.name, text }); setCheck(null); setBusy(true);
    try { setCheck(await api("/api/teacher/questions/import", { body: { csv: text, dryRun: true } })); }
    catch (e) { toast((e as Error).message, "info"); }
    finally { setBusy(false); }
  };
  const commit = async () => {
    if (!csv) return;
    setBusy(true);
    try {
      const r = await api<{ created: number; updated: number }>("/api/teacher/questions/import", { body: { csv: csv.text, dryRun: false } });
      toast(`Đã nhập: ${r.created} câu mới, ${r.updated} câu cập nhật`, "ok");
      setCsv(null); setCheck(null); onDone();
    } catch (e) { toast((e as Error).message, "info"); }
    finally { setBusy(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nhập câu hỏi từ CSV" wide>
      <ol className="space-y-2 text-ink-2 text-sm list-decimal pl-5">
        <li>Tải <button type="button" className="font-bold text-deep underline cursor-pointer" onClick={() => downloadText("mau-cau-hoi.csv", TEMPLATE)}>file mẫu</button> và mở bằng Excel.</li>
        <li>Mỗi dòng một câu. Cột <b>dap_an</b> ghi A/B/C/D. <b>cap_do</b>: co-ban hoặc nang-cao. Cột <b>ma</b> để trống = thêm mới; trùng mã có sẵn = cập nhật câu đó.</li>
        <li>Lưu lại dạng <b>CSV UTF-8</b> rồi chọn file bên dưới. Hệ thống kiểm tra trước, chưa ghi gì cho tới khi bạn xác nhận.</li>
      </ol>
      <label className="mt-4 flex items-center justify-center gap-2 min-h-14 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 font-bold text-deep cursor-pointer hover:bg-sky-50">
        <FileUp className="size-5" aria-hidden /> {csv ? csv.name : "Chọn file .csv"}
        <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
      </label>
      {busy && <p className="mt-3 inline-flex items-center gap-2 text-ink-2"><Loader2 className="size-4 animate-spin" aria-hidden /> Đang xử lý…</p>}
      {check && (
        <div className="mt-4">
          {check.errors.length ? (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
              <p className="font-bold text-red-800">Có {check.errors.length} dòng lỗi — sửa trong file rồi chọn lại:</p>
              <ul className="mt-2 max-h-48 overflow-y-auto text-sm text-red-900 space-y-0.5">
                {check.errors.slice(0, 50).map((e, i) => <li key={i}>Dòng {e.line}: {e.message}</li>)}
              </ul>
            </div>
          ) : (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex flex-wrap items-center gap-3">
              <p className="font-bold text-emerald-900 flex-1">File hợp lệ: {check.created} câu mới, {check.updated} câu sẽ được cập nhật.</p>
              <Button icon={Check} disabled={busy} onClick={() => void commit()}>Xác nhận nhập</Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
