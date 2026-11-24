import { motion } from "motion/react";
import { ChartNoAxesColumn, GraduationCap, LogOut, Play, Quote, Sparkles, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { once, useIsClient } from "../lib/client";
import { ArenaHero } from "../components/ArenaHero";
import { Button, StickyActions } from "../components/ui";
import { QUOTES } from "../data/meta";
import { GoogleButton } from "../components/GoogleButton";
import { useToast } from "../components/Toast";
import type { Profile } from "../lib/storage";
import { useSession } from "../lib/session";

const pickQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

export function Welcome({ profile, onStart, onAchievements }: {
  profile: Profile; onStart: (p: Profile) => void; onAchievements: () => void;
}) {
  // Câu danh ngôn ngẫu nhiên chỉ chọn ở trình duyệt (tránh lệch HTML server/client)
  const isClient = useIsClient();
  const quote = isClient ? once("quote", pickQuote) : QUOTES[0];
  const { me, ready, googleEnabled, signIn, signOut, update } = useSession();
  // Component được remount (key) khi hồ sơ/tài khoản đổi, nên khởi tạo thẳng từ props
  const [name, setName] = useState(me?.nickname ?? profile.name);
  const [cls, setCls] = useState(me ? me.className ?? "" : profile.className);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim().replace(/\s+/g, " ").slice(0, 24);
    const c = cls.trim().slice(0, 8).toUpperCase();
    if (!n) { setError("Nhập tên hoặc biệt danh để lưu điểm của bạn nhé."); return; }
    if (me && (n !== me.nickname || c !== (me.className ?? ""))) {
      try { await update({ nickname: n, className: c }); } catch { toast("Chưa lưu được tên hiển thị, thử lại sau nhé.", "info"); }
    }
    onStart({ name: n, className: c });
  };
  const login = async () => {
    setBusy(true);
    try { await signIn(); } catch { toast("Không mở được trang đăng nhập Google.", "info"); }
    setBusy(false);
  };

  return (
    <div className="container-arena grid lg:grid-cols-[1.05fr_1fr] items-center gap-x-10 gap-y-2 pb-10 pt-2 lg:pt-6">
      {/* Visual — trên mobile ở trên cùng, desktop ở bên phải */}
      <motion.div className="lg:order-2 -mx-2 sm:mx-auto w-[calc(100%+16px)] sm:w-full max-w-[620px] 2xl:max-w-[760px]"
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <ArenaHero />
      </motion.div>

      <div className="lg:order-1 text-center lg:text-left -mt-[10%] sm:-mt-[6%] lg:mt-0 relative z-10">
        <motion.span className="pill mb-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Sparkles className="size-4" aria-hidden /> Sân chơi tri thức · Khối 6 – 9
        </motion.span>
        <motion.h1
          className="font-black uppercase leading-[1.06] pt-[.12em] tracking-tight text-[length:var(--fs-hero)] title-gradient drop-shadow-[0_2px_0_rgba(255,255,255,.8)]"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
        >
          Đấu trường<br />tri thức
        </motion.h1>
        <motion.p className="mt-2 font-extrabold tracking-[.32em] text-deep text-[clamp(.9rem,.8rem+.5vw,1.35rem)]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          THCS NGA SƠN
        </motion.p>

        <motion.figure className="glass-soft mt-5 px-5 py-4 text-left flex gap-3 max-w-[560px] mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Quote className="size-6 text-emerald-brand shrink-0 -scale-x-100" aria-hidden strokeWidth={2.6} />
          <div>
            <blockquote className="italic font-semibold text-ink leading-snug">“{quote.text}”</blockquote>
            <figcaption className="mt-1 text-[var(--fs-small)] text-ink-3 font-medium">— {quote.by}</figcaption>
          </div>
        </motion.figure>

        <motion.form id="welcome-form" onSubmit={submit} noValidate className="glass mt-4 p-4 sm:p-5 max-w-[560px] mx-auto lg:mx-0 text-left"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          {ready && me && (
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-dashed border-sky-100">
              {me.image
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={me.image} alt="" referrerPolicy="no-referrer" className="size-11 rounded-2xl object-cover" />
                : <span className="grid place-items-center size-11 rounded-2xl btn-primary font-black">{me.nickname.charAt(0)}</span>}
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-ink truncate">Xin chào, {me.nickname}!</div>
                <div className="text-[var(--fs-small)] text-ink-3 font-medium">Đã đăng nhập Google · điểm được lưu & xếp hạng</div>
              </div>
              <button type="button" onClick={() => void signOut()} className="inline-flex items-center gap-1.5 min-h-11 px-2.5 rounded-xl text-[var(--fs-small)] font-bold text-ink-3 hover:bg-slate-100 cursor-pointer">
                <LogOut className="size-4" aria-hidden /> <span className="max-sm:sr-only">Đăng xuất</span>
              </button>
            </div>
          )}
          {ready && !me && googleEnabled && (
            <div className="mb-4">
              <GoogleButton onClick={login} busy={busy} className="w-full" />
              <p className="mt-2 text-center text-[var(--fs-small)] text-ink-3 font-medium">Lưu điểm trên mọi thiết bị và ghi danh <b className="text-deep">bảng xếp hạng</b></p>
              <div className="mt-4 flex items-center gap-3 text-xs font-bold text-ink-3 uppercase tracking-wider">
                <span className="h-px flex-1 bg-sky-100" /> hoặc chơi với tư cách khách <span className="h-px flex-1 bg-sky-100" />
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-[1fr_150px] gap-3">
            <label className="block">
              <span className="block text-[var(--fs-small)] font-bold text-ink-2 mb-1.5">{me ? "Tên trên bảng xếp hạng" : "Tên / biệt danh"} <span className="text-bad" aria-hidden>*</span></span>
              <span className="relative block">
                <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-sky-brand" aria-hidden />
                <input
                  value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
                  maxLength={24} autoComplete="nickname" required aria-invalid={!!error} aria-describedby={error ? "name-err" : undefined}
                  placeholder="Ví dụ: Minh Anh"
                  className="w-full min-h-13 rounded-2xl bg-white border-2 border-sky-100 pl-11 pr-3 font-semibold text-ink placeholder:text-slate-400 focus:border-sky-brand focus:outline-none transition"
                />
              </span>
            </label>
            <label className="block">
              <span className="block text-[var(--fs-small)] font-bold text-ink-2 mb-1.5">Lớp <span className="font-medium text-ink-3">· tùy chọn</span></span>
              <span className="relative block">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-sky-brand" aria-hidden />
                <input
                  value={cls} onChange={(e) => setCls(e.target.value)} maxLength={8} placeholder="8A"
                  className="w-full min-h-13 rounded-2xl bg-white border-2 border-sky-100 pl-11 pr-3 font-semibold text-ink uppercase placeholder:normal-case placeholder:text-slate-400 focus:border-sky-brand focus:outline-none transition"
                />
              </span>
            </label>
          </div>
          {error && <p id="name-err" role="alert" className="mt-2 text-[var(--fs-small)] font-semibold text-bad">{error}</p>}
          <Button type="submit" size="lg" block iconRight={Play} className="mt-4 shine max-lg:hidden">BẮT ĐẦU HÀNH TRÌNH</Button>
          <Button type="button" variant="ghost" block icon={ChartNoAxesColumn} onClick={onAchievements} className="mt-1.5">
            Xem thành tích của tôi
          </Button>
        </motion.form>
      </div>

      {/* Điện thoại/máy tính bảng: nút bắt đầu dính đáy màn hình (form nằm dưới hình minh hoạ) */}
      <StickyActions className="lg:hidden col-span-full">
        <Button type="submit" form="welcome-form" size="lg" block iconRight={Play} className="shine">BẮT ĐẦU HÀNH TRÌNH</Button>
      </StickyActions>
    </div>
  );
}
