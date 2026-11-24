import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GameFrame } from "@/features/portal/GameFrame";
import { GAMES, gameBySlug } from "@/lib/modules";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/tro-choi/[slug]">): Promise<Metadata> {
  const g = gameBySlug((await props.params).slug);
  // Gọi notFound ở đây (trước khi stream nội dung) để slug sai trả đúng mã 404
  if (!g) notFound();
  return { title: g.title, description: g.tagline };
}

async function Game({ params }: { params: PageProps<"/tro-choi/[slug]">["params"] }) {
  const g = gameBySlug((await params).slug);
  if (!g) notFound();
  return <GameFrame slug={g.slug} />;
}

/** Trang chơi 1 trò chơi STEM (các slug trong danh mục được prerender sẵn) */
export default function GamePage(props: PageProps<"/tro-choi/[slug]">) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
      <Game params={props.params} />
    </Suspense>
  );
}
