import { ArenaShell } from "@/features/arena/ArenaShell";
import { PortalHome } from "@/features/portal/PortalHome";

/** Trang chủ cổng: Đấu Trường Tri Thức + các trò chơi STEM */
export default function Home() {
  return (
    <ArenaShell>
      <PortalHome />
    </ArenaShell>
  );
}
