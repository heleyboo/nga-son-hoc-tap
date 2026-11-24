import { Flag, Send } from "lucide-react";
import { useState } from "react";
import type { RoundQuestion } from "../data/types";
import { sendReport, type ReportReason } from "../lib/api";
import { MathText } from "./MathText";
import { useToast } from "./Toast";
import { Button, Modal, Note, cx } from "./ui";

const REASONS: { label: string; code: ReportReason }[] = [
  { label: "Sai đáp án", code: "wrong_answer" },
  { label: "Thiếu đáp án đúng", code: "wrong_answer" },
  { label: "Câu hỏi khó hiểu", code: "unclear" },
  { label: "Lỗi chính tả", code: "typo" },
  { label: "Giải thích chưa đúng", code: "other" },
  { label: "Khác", code: "other" },
];

export function ReportDialog({ question, onClose }: { question: RoundQuestion | null; onClose: () => void }) {
  return (
    <Modal open={!!question} onClose={onClose} title={<span className="flex items-center gap-2"><Flag className="size-6 text-bad" aria-hidden /> Báo lỗi câu hỏi</span>}>
      {/* key: mở cho câu khác thì form tự làm mới */}
      {question && <ReportForm key={question.id} question={question} onClose={onClose} />}
    </Modal>
  );
}

function ReportForm({ question, onClose }: { question: RoundQuestion; onClose: () => void }) {
  const toast = useToast();
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!reason) return;
    setBusy(true);
    const r = REASONS.find((x) => x.label === reason)!;
    // Ghi rõ lựa chọn chi tiết vào ghi chú vì server chỉ có 4 nhóm lý do
    const detail = [r.label !== "Sai đáp án" && r.label !== "Khác" ? r.label : "", note.trim()].filter(Boolean).join(" — ");
    try {
      await sendReport(question, r.code, detail);
      toast("Đã gửi báo lỗi tới thầy cô. Cảm ơn bạn!");
      onClose();
    } catch {
      toast("Chưa gửi được báo lỗi — kiểm tra kết nối rồi thử lại.", "info");
    } finally {
      setBusy(false);
    }
  };

  return (
        <div className="grid gap-4">
          <div className="rounded-2xl bg-sky-50 border border-sky-100 p-3.5 text-ink font-semibold">
            <div className="text-xs font-bold text-ink-3 mb-1">Mã câu: {question.code}</div>
            <MathText text={question.q} />
          </div>
          <div>
            <div id="reason-label" className="font-bold text-ink mb-2">Vấn đề bạn gặp là gì?</div>
            <div role="radiogroup" aria-labelledby="reason-label" className="flex flex-wrap gap-2">
              {REASONS.map(({ label: r }) => (
                <button key={r} type="button" role="radio" aria-checked={reason === r} onClick={() => setReason(r)}
                  className={cx("min-h-11 px-3.5 rounded-full border-2 font-semibold text-[var(--fs-small)] cursor-pointer transition-colors",
                    reason === r ? "bg-red-50 border-bad text-red-800" : "bg-white border-slate-200 text-ink-2 hover:border-red-200")}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="block font-bold text-ink mb-1.5">Mô tả thêm <span className="font-medium text-ink-3">(không bắt buộc)</span></span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} rows={3}
              placeholder="Ví dụ: Em nghĩ đáp án đúng phải là B vì…"
              className="w-full rounded-2xl border-2 border-sky-100 bg-white p-3 text-ink focus:border-sky-brand focus:outline-none resize-y" />
          </label>
          <Note tone="emerald" icon={Send}>Báo lỗi được gửi lên hệ thống để thầy cô kiểm tra và sửa câu hỏi.</Note>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
            <Button variant="primary" icon={Flag} onClick={send} disabled={!reason || busy}>Gửi báo lỗi</Button>
          </div>
        </div>
  );
}
