"use client";
import { MotionConfig } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Background } from "./components/Background";
import { ToastProvider } from "./components/Toast";
import { SessionProvider } from "./lib/session";

/** Khung chung cho mọi trang /dau-truong/*: nền, phiên đăng nhập, thông báo, tôn trọng reduced-motion */
export function ArenaShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SessionProvider>
        <ToastProvider>
          <div className="arena-root">
            <Background />
            {children}
            <footer className="container-arena py-6 text-center text-xs text-ink-3 font-medium">
              Đấu Trường Tri Thức · Web Học Tập THCS Nga Sơn ·{" "}
              <Link href="/cong-nghe" className="underline hover:text-deep">Bên trong ứng dụng</Link> ·{" "}
              <Link href="/chinh-sach" className="underline hover:text-deep">Chính sách quyền riêng tư</Link>
            </footer>
          </div>
        </ToastProvider>
      </SessionProvider>
    </MotionConfig>
  );
}
