import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { PwaClient } from "@/lib/pwa/PwaClient";

const font = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Web Học Tập THCS Nga Sơn", template: "%s · THCS Nga Sơn" },
  description: "Cổng hệ thống STEM & học tập của trường THCS Nga Sơn",
  applicationName: "THCS Nga Sơn",
  appleWebApp: { capable: true, title: "THCS Nga Sơn", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0284c7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${font.variable} antialiased`}>
      <body className="font-sans">{children}<PwaClient /></body>
    </html>
  );
}
