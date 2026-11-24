/**
 * Hiệu ứng âm thanh tổng hợp bằng Web Audio — không cần file âm thanh (nhẹ, chạy được khi mạng chậm).
 *
 *   sfx.correct()  trả lời đúng           sfx.wrong()     trả lời sai
 *   sfx.timeout()  hết giờ                sfx.tick(n)     đếm ngược n = 5…1 giây cuối
 *   sfx.combo(n)   chuỗi đúng ≥ 3         sfx.start()     bắt đầu lượt / mở câu
 *   sfx.next()     chuyển câu             sfx.finish()    xong lượt
 *   sfx.fanfare()  kết quả xuất sắc       sfx.badge()     nhận huy hiệu
 *   sfx.join()     học sinh vào phòng     sfx.reveal()    công bố đáp án
 *   sfx.tap()      chạm nhẹ (chọn đáp án)
 *
 * Trình duyệt chỉ cho phát âm thanh sau khi người dùng chạm/bấm lần đầu → tự "mở khoá" ở lần tương tác đầu.
 * Bật/tắt lưu ở localStorage("sfx-muted"); dùng useSfxMuted()/toggleSfx() cho nút loa.
 */
import { useSyncExternalStore } from "react";

type Wave = OscillatorType;
const KEY = "sfx-muted";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try { muted = localStorage.getItem(KEY) === "1"; } catch { /* storage bị chặn */ }
  // mở khoá AudioContext ở lần chạm/bấm phím đầu tiên (chính sách autoplay của trình duyệt)
  const unlock = () => {
    const c = audio();
    if (c && c.state === "suspended") void c.resume();
  };
  window.addEventListener("pointerdown", unlock, { capture: true, passive: true });
  window.addEventListener("keydown", unlock, { capture: true });
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    // nén nhẹ để nhiều âm chồng nhau không bị rè trên loa máy chiếu
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    master.connect(comp).connect(ctx.destination);
  }
  return ctx;
}

/** Một nốt có bao âm (attack/decay) — nền tảng của mọi hiệu ứng */
function tone(freq: number, start: number, dur: number, o: { type?: Wave; vol?: number; to?: number; attack?: number } = {}) {
  const c = audio();
  if (!c || !master) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t0);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
  const vol = o.vol ?? 0.3;
  const atk = o.attack ?? 0.008;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Tiếng "xì" ngắn bằng nhiễu trắng (dùng cho chuyển cảnh) */
function noise(start: number, dur: number, vol = 0.12, from = 800, to = 4000) {
  const c = audio();
  if (!c || !master) return;
  const t0 = c.currentTime + start;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t0);
}

// chặn phát chồng cùng một hiệu ứng trong thời gian rất ngắn (vd StrictMode gọi 2 lần)
const last = new Map<string, number>();
function play(name: string, fn: () => void, gapMs = 60) {
  if (muted || typeof window === "undefined") return;
  const now = performance.now();
  if (now - (last.get(name) ?? 0) < gapMs) return;
  last.set(name, now);
  // móc kiểm thử tự động: chỉ ghi khi trang đã tạo sẵn window.__sfxLog
  (window as unknown as { __sfxLog?: string[] }).__sfxLog?.push(name);
  const c = audio();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  fn();
}

const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5, E6 = 1318.5, G6 = 1568;

export const sfx = {
  /** Đúng: hai nốt đi lên sáng, vui */
  correct: () => play("correct", () => {
    tone(E5 * 1.5, 0, 0.12, { type: "triangle", vol: 0.28 });
    tone(C6 * 1.25, 0.09, 0.28, { type: "triangle", vol: 0.3 });
    tone(C6 * 2.5, 0.09, 0.22, { type: "sine", vol: 0.06 });
  }),
  /** Sai: hai nốt trầm đi xuống, ngắn, không chói */
  wrong: () => play("wrong", () => {
    tone(220, 0, 0.16, { type: "square", vol: 0.09, to: 196 });
    tone(165, 0.14, 0.3, { type: "square", vol: 0.1, to: 130 });
  }),
  /** Hết giờ: "bùm bụp" trầm */
  timeout: () => play("timeout", () => {
    tone(330, 0, 0.14, { type: "triangle", vol: 0.25 });
    tone(247, 0.16, 0.14, { type: "triangle", vol: 0.25 });
    tone(165, 0.32, 0.38, { type: "triangle", vol: 0.28, to: 140 });
  }),
  /** Đếm ngược: tích tắc, giây cuối cao và to hơn */
  tick: (secondsLeft: number) => play(`tick${secondsLeft}`, () => {
    const urgent = secondsLeft <= 1;
    tone(urgent ? 1320 : secondsLeft <= 3 ? 1100 : 900, 0, 0.07, { type: "square", vol: urgent ? 0.1 : 0.07 });
  }, 400),
  /** Chuỗi đúng liên tiếp: chuỗi nốt lấp lánh, càng dài càng cao */
  combo: (n: number) => play("combo", () => {
    const base = Math.min(1.5, 1 + (n - 3) * 0.08);
    [C6, E6, G6, C6 * 2].forEach((f, i) => tone(f * base, 0.18 + i * 0.05, 0.16, { type: "sine", vol: 0.12 }));
  }),
  /** Bắt đầu: tiếng vút đi lên */
  start: () => play("start", () => {
    noise(0, 0.35, 0.08, 400, 3000);
    tone(330, 0, 0.35, { type: "sine", vol: 0.15, to: 880 });
  }),
  /** Chuyển câu: "xoẹt" nhẹ */
  next: () => play("next", () => { noise(0, 0.18, 0.06, 1200, 5000); }),
  /** Chạm chọn đáp án */
  tap: () => play("tap", () => { tone(700, 0, 0.05, { type: "sine", vol: 0.12 }); }, 30),
  /** Xong lượt: ba nốt nhẹ nhàng */
  finish: () => play("finish", () => {
    [C5, E5, G5].forEach((f, i) => tone(f, i * 0.12, 0.35, { type: "triangle", vol: 0.22 }));
  }),
  /** Xuất sắc / vinh danh: kèn chiến thắng + hợp âm */
  fanfare: () => play("fanfare", () => {
    const seq = [G5, C6, E6, G6];
    seq.forEach((f, i) => tone(f, i * 0.11, 0.2, { type: "square", vol: 0.07 }));
    [C6, E6, G6].forEach((f) => tone(f, 0.48, 0.9, { type: "triangle", vol: 0.14, attack: 0.02 }));
    tone(C5, 0.48, 0.9, { type: "sine", vol: 0.18, attack: 0.02 });
  }, 800),
  /** Nhận huy hiệu: chuông */
  badge: () => play("badge", () => {
    tone(G6, 0, 0.6, { type: "sine", vol: 0.14 });
    tone(G6 * 2, 0, 0.4, { type: "sine", vol: 0.05 });
    tone(C6 * 2, 0.12, 0.7, { type: "sine", vol: 0.12 });
  }),
  /** Học sinh vào phòng: "bụp" bong bóng */
  join: () => play("join", () => { tone(500, 0, 0.12, { type: "sine", vol: 0.2, to: 1100 }); }, 120),
  /** Công bố đáp án: "tà-đa" */
  reveal: () => play("reveal", () => {
    tone(G5, 0, 0.12, { type: "triangle", vol: 0.22 });
    tone(C6, 0.13, 0.4, { type: "triangle", vol: 0.26 });
    tone(E6, 0.13, 0.4, { type: "sine", vol: 0.1 });
  }),
};

/** Rung nhẹ trên điện thoại hỗ trợ (Android); iPhone bỏ qua. Không rung khi đã tắt âm thanh. */
export function vibrate(pattern: number | number[]) {
  if (muted) return;
  try { navigator.vibrate?.(pattern); } catch { /* không hỗ trợ */ }
}

/* ---------- bật/tắt âm thanh ---------- */
export function setSfxMuted(v: boolean) {
  muted = v;
  try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* bỏ qua */ }
  listeners.forEach((l) => l());
  if (!v) sfx.tap();
}
export const toggleSfx = () => setSfxMuted(!muted);
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
/** true = đang tắt tiếng. Ở server luôn false để HTML khớp khi hydrate. */
export const useSfxMuted = () => useSyncExternalStore(subscribe, () => muted, () => false);
