import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Library, Trophy as TrophyIcon } from "lucide-react";
import { useState } from "react";
import { Button, ScreenTitle, cx } from "../components/ui";
import { GRADES } from "../data/meta";
import type { Catalog, Grade } from "../data/types";
import type { Best } from "../lib/storage";

const LIST: Grade[] = [6, 7, 8, 9];

export function GradeSelect({ current, player, catalog, bests, onPick, onBack }: {
  current: Grade | null; player: string; catalog: Catalog | null; bests: Record<string, Best>; onPick: (g: Grade) => void; onBack: () => void;
}) {
  const [picked, setPicked] = useState<Grade | null>(null);
  const choose = (g: Grade) => {
    if (picked) return;
    setPicked(g);
    setTimeout(() => onPick(g), 260);
  };
  return (
    <div className="container-arena pb-10">
      <ScreenTitle
        eyebrow={<span className="pill">Xin chào, {player || "chiến binh"}!</span>}
        title="Chọn khối lớp"
        sub="Hãy chọn khối lớp của bạn để bắt đầu thử thách."
      />
      <div role="radiogroup" aria-label="Khối lớp" className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 max-w-[880px] 2xl:max-w-[1200px] mx-auto">
        {LIST.map((g, i) => {
          const m = GRADES[g];
          const bank = Object.values(catalog?.[g] ?? {}).reduce((s, lv) => s + Object.values(lv ?? {}).reduce((a, n) => a + (n ?? 0), 0), 0);
          const best = Object.entries(bests).filter(([k]) => k.startsWith(`${g}-`)).map(([, v]) => v)
            .sort((a, b) => b.pct - a.pct || b.score - a.score)[0];
          const isSel = picked === g || (!picked && current === g);
          return (
            <motion.button
              key={g}
              type="button" role="radio" aria-checked={isSel}
              onClick={() => choose(g)}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
              className={cx(
                "group relative overflow-hidden text-left text-white rounded-[26px] p-4 sm:p-6 cursor-pointer",
                "min-h-[104px] sm:min-h-[190px] 2xl:min-h-[260px] flex sm:flex-col gap-4 items-center sm:items-start",
                "shadow-[0_18px_36px_-18px_var(--g)] transition-shadow hover:shadow-[0_26px_44px_-18px_var(--g)]",
                isSel && "ring-4 ring-white outline-[3px] outline-offset-0",
              )}
              style={{ background: `linear-gradient(135deg, ${m.from}, ${m.to})`, ["--g" as string]: m.to, outlineColor: isSel ? m.to : undefined, outlineStyle: isSel ? "solid" : undefined }}
            >
              {/* trang trí */}
              <span aria-hidden className="absolute -right-3 -bottom-10 sm:-bottom-14 font-black leading-none text-white/15 text-[150px] sm:text-[210px] 2xl:text-[280px] select-none">{g}</span>
              <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,.35),transparent_55%)]" />
              <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full border-[14px] border-white/10" />

              <span className="relative grid place-items-center size-14 sm:size-16 rounded-2xl bg-white/20 border border-white/40 backdrop-blur shrink-0">
                {isSel ? <Check className="size-8" strokeWidth={3} aria-hidden /> : <Library className="size-7 sm:size-8" strokeWidth={2.2} aria-hidden />}
              </span>
              <span className="relative flex-1 min-w-0">
                <span className="block font-black tracking-tight text-[clamp(1.35rem,1.1rem+1.2vw,2.6rem)] leading-none">{m.name}</span>
                <span className="block mt-1 font-semibold text-white/90 text-[var(--fs-small)]">{m.tagline}</span>
                <span className="mt-2.5 sm:mt-4 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs sm:text-sm font-bold">
                    {catalog ? `${bank} câu hỏi` : "…"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs sm:text-sm font-bold" style={{ color: m.ink }}>
                    <TrophyIcon className="size-3.5" aria-hidden />
                    {best ? `Điểm cao: ${best.correct}/${best.total}` : "Chưa có điểm"}
                  </span>
                </span>
              </span>
              <ArrowRight aria-hidden className="relative size-6 shrink-0 sm:absolute sm:right-6 sm:top-6 opacity-80 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>Quay lại</Button>
      </div>
    </div>
  );
}
