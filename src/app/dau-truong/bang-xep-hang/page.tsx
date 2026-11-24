import type { Metadata } from "next";
import { Suspense } from "react";
import { BoardsHub, type BoardKind } from "@/features/arena/BoardsHub";
import type { Grade } from "@/features/arena/data/types";
import { leaderboardQuery } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Bảng xếp hạng · Đấu Trường Tri Thức",
  description: "Bảng xếp hạng tuần, tháng và mọi lúc của Đấu Trường Tri Thức THCS Nga Sơn.",
};

async function Board({ searchParams }: { searchParams: PageProps<"/dau-truong/bang-xep-hang">["searchParams"] }) {
  const sp = await searchParams;
  const flat = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const parsed = leaderboardQuery.safeParse(flat);
  const q = parsed.success ? parsed.data : leaderboardQuery.parse({});
  const kind: BoardKind = flat.bang === "xp" || flat.bang === "game" ? flat.bang : "arena";
  return <BoardsHub initialKind={kind} initial={{ grade: q.grade as Grade | "all", level: q.level, mode: q.mode, period: q.period }} />;
}

export default function LeaderboardPage(props: PageProps<"/dau-truong/bang-xep-hang">) {
  return (
    <Suspense fallback={<div className="container-arena py-16 text-center text-ink-3 font-semibold">Đang tải bảng xếp hạng…</div>}>
      <Board searchParams={props.searchParams} />
    </Suspense>
  );
}
