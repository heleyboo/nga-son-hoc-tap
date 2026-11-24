import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type Tone = "ok" | "info";
interface ToastItem { id: number; text: string; tone: Tone }
const Ctx = createContext<(text: string, tone?: Tone) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const n = useRef(0);
  const push = useCallback((text: string, tone: Tone = "ok") => {
    const id = ++n.current;
    setItems((s) => [...s, { id, text, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="fixed z-[60] left-1/2 -translate-x-1/2 bottom-[max(16px,env(safe-area-inset-bottom))] flex flex-col items-center gap-2 w-[min(92vw,440px)] pointer-events-none" aria-live="polite" role="status">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ y: 20, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 10, opacity: 0 }}
              className="glass !rounded-2xl !bg-white/95 px-4 py-3 flex items-center gap-2.5 font-semibold text-ink text-[var(--fs-small)] w-full"
            >
              {t.tone === "ok" ? <CheckCircle2 className="size-5 text-ok shrink-0" aria-hidden /> : <Info className="size-5 text-sky-brand shrink-0" aria-hidden />}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
