"use client";
import {
  BookOpenCheck, ClipboardList, Flag, LayoutDashboard, Loader2, Radio, ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/features/arena/components/TopBar";
import { GoogleButton } from "@/features/arena/components/GoogleButton";
import { cx } from "@/features/arena/components/ui";
import { useSession } from "@/features/arena/lib/session";
import { setUrlParam, useUrlParam } from "@/features/live/shared";
import { Assignments } from "./Assignments";
import { LiveHistory } from "./LiveHistory";
import { Overview } from "./Overview";
import { QuestionBank } from "./QuestionBank";
import { Reports } from "./Reports";

const TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "tong-quan", label: "Tổng quan", icon: LayoutDashboard },
  { id: "cau-hoi", label: "Ngân hàng câu hỏi", icon: BookOpenCheck },
  { id: "bao-loi", label: "Báo lỗi & góp ý", icon: Flag },
  { id: "bai-giao", label: "Bài giao", icon: ClipboardList },
  { id: "truc-tiep", label: "Lớp trực tiếp", icon: Radio },
];

/** Trang quản lý cho giáo viên (/giao-vien). Quyền được kiểm tra lại ở mọi API. */
export function TeacherApp() {
  const { me, ready, googleEnabled, signIn } = useSession();
  const tab = useUrlParam("tab") ?? "tong-quan";

  return (
    <>
      <TopBar brand={{ title: "QUẢN LÝ GIÁO VIÊN", subtitle: "Web Học Tập THCS Nga Sơn", href: "/" }} />
      <main className="container-arena pb-10">
        {!ready ? (
          <div className="py-24 grid place-items-center"><Loader2 className="size-8 animate-spin text-sky-brand" aria-hidden /></div>
        ) : !me?.isTeacher ? (
          <div className="glass max-w-lg mx-auto mt-10 p-7 text-center">
            <ShieldAlert className="size-12 mx-auto text-amber-600" aria-hidden />
            <h1 className="mt-3 font-black text-2xl text-ink">Khu vực dành cho giáo viên</h1>
            {!me ? (<>
              <p className="mt-2 text-ink-2">Đăng nhập bằng tài khoản Google đã được cấp quyền giáo viên.</p>
              {googleEnabled
                ? <GoogleButton className="mt-5" onClick={() => void signIn()} />
                : <p className="mt-4 text-sm text-ink-3">Máy chủ chưa cấu hình đăng nhập Google.</p>}
            </>) : (
              <p className="mt-2 text-ink-2">
                Tài khoản <b>{me.name}</b> chưa có quyền giáo viên. Nhờ quản trị viên thêm email của bạn vào <code className="text-sm">TEACHER_EMAILS</code> trong cấu hình máy chủ.
              </p>
            )}
            <Link href="/" className="mt-5 inline-block text-sm font-semibold text-ink-3 hover:text-deep">Về trang chủ</Link>
          </div>
        ) : (
          <>
            <nav aria-label="Mục quản lý" className="mt-1 mb-5 flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {TABS.map((t) => {
                const Icon = t.icon;
                const on = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setUrlParam("tab", t.id)} aria-current={on ? "page" : undefined}
                    className={cx("inline-flex items-center gap-2 min-h-11 px-4 rounded-2xl font-bold whitespace-nowrap transition cursor-pointer",
                      on ? "bg-white text-deep shadow-[0_10px_24px_-14px_rgba(2,132,199,.6)] border border-sky-200" : "text-ink-2 hover:bg-white/70")}>
                    <Icon className="size-4.5" aria-hidden /> {t.label}
                  </button>
                );
              })}
            </nav>
            {tab === "tong-quan" && <Overview onGo={(t) => setUrlParam("tab", t)} />}
            {tab === "cau-hoi" && <QuestionBank />}
            {tab === "bao-loi" && <Reports />}
            {tab === "bai-giao" && <Assignments />}
            {tab === "truc-tiep" && <LiveHistory />}
          </>
        )}
      </main>
    </>
  );
}
