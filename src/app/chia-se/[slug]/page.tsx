import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArenaShell } from "@/features/arena/ArenaShell";
import { getShare, publicOrigin } from "@/lib/share";

type Props = PageProps<"/chia-se/[slug]">;

/** Ảnh xem trước + mô tả khi dán link vào Zalo/Facebook/Messenger */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const s = getShare((await props.params).slug);
  if (!s) notFound();
  const c = s.card;
  const title = `${c.name} đạt ${c.score.toLocaleString("vi-VN")} điểm · ${c.title}`;
  const description = `${c.subtitle} · ${c.chips.join(" · ")}. Bạn có làm tốt hơn không?`;
  const image = { url: `/api/share/${s.slug}/image`, width: 1200, height: 630, alt: title };
  return {
    metadataBase: new URL(publicOrigin()),
    title, description,
    openGraph: { title, description, type: "website", locale: "vi_VN", siteName: "Web Học Tập THCS Nga Sơn", images: [image], url: `/chia-se/${s.slug}` },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
    robots: { index: false },
  };
}

async function Card({ params }: { params: Props["params"] }) {
  const s = getShare((await params).slug);
  if (!s) notFound();
  const c = s.card;
  return (
    <main className="container-arena max-w-3xl py-8 sm:py-12">
      <div className="glass p-3 sm:p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/api/share/${s.slug}/image`} alt={`Thẻ thành tích: ${c.name} đạt ${c.score} điểm, ${c.correct}/${c.total} câu đúng`}
          width={1200} height={630} className="w-full h-auto rounded-[20px]" />
      </div>
      <div className="mt-6 text-center">
        <h1 className="font-black text-[length:var(--fs-h1)] leading-tight title-gradient">{c.name} đạt {c.score.toLocaleString("vi-VN")} điểm!</h1>
        <p className="mt-2 text-ink-2 font-semibold">{c.title} · {c.subtitle}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={c.cta} className="inline-flex items-center justify-center min-h-14 px-8 rounded-[20px] btn-primary font-extrabold text-lg">Thử sức ngay</Link>
          <Link href="/" className="inline-flex items-center justify-center min-h-14 px-6 rounded-[20px] bg-white/90 text-deep border border-sky-100 font-extrabold">Khám phá Web Học Tập</Link>
        </div>
      </div>
    </main>
  );
}

/** Trang công khai của một thẻ thành tích */
export default function SharePage(props: Props) {
  return (
    <ArenaShell>
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Card params={props.params} />
      </Suspense>
    </ArenaShell>
  );
}
