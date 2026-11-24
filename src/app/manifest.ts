import type { MetadataRoute } from "next";

/** Khai báo ứng dụng (PWA): cho phép “Thêm vào màn hình chính” và mở như một app riêng */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Web Học Tập THCS Nga Sơn",
    short_name: "THCS Nga Sơn",
    description: "Đấu Trường Tri Thức, thử thách mỗi ngày, lớp học trực tiếp và trò chơi STEM cho học sinh khối 6–9.",
    lang: "vi",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#eefaff",
    theme_color: "#0284c7",
    categories: ["education", "games"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Đấu Trường Tri Thức", short_name: "Đấu Trường", url: "/dau-truong", icons: [{ src: "/icons/shortcut.png", sizes: "96x96" }] },
      { name: "Thử thách mỗi ngày", short_name: "Thử thách", url: "/thu-thach", icons: [{ src: "/icons/shortcut.png", sizes: "96x96" }] },
      { name: "Vào lớp học trực tiếp", short_name: "Vào lớp", url: "/tham-gia", icons: [{ src: "/icons/shortcut.png", sizes: "96x96" }] },
      { name: "Trò chơi STEM", short_name: "Trò chơi", url: "/#tro-choi", icons: [{ src: "/icons/shortcut.png", sizes: "96x96" }] },
    ],
  };
}
