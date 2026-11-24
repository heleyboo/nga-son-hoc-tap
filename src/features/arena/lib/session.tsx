"use client";
import { createAuthClient } from "better-auth/react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Me } from "../data/types";
import { fetchMe, updateMe } from "./api";

const authClient = createAuthClient();

interface SessionState {
  me: Me | null;
  ready: boolean;
  googleEnabled: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  update: (d: { nickname: string; className?: string }) => Promise<void>;
}
const Ctx = createContext<SessionState | null>(null);

export function useSession() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useSession phải nằm trong SessionProvider");
  return s;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);
  const [googleEnabled, setGoogle] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchMe()
      .then((r) => { if (alive) { setMe(r.user); setGoogle(r.googleEnabled); } })
      .catch(() => { if (alive) setMe(null); })
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  const signIn = useCallback(async () => {
    const callbackURL = location.pathname + location.search;
    // Trang Google không hiển thị trong iframe → khi bị nhúng thì mở tab mới
    const framed = (() => { try { return window.self !== window.top; } catch { return true; } })();
    if (framed) {
      const r = await authClient.signIn.social({ provider: "google", callbackURL, disableRedirect: true });
      if (r.data?.url) window.open(r.data.url, "_blank", "noopener");
      return;
    }
    await authClient.signIn.social({ provider: "google", callbackURL, errorCallbackURL: "/dau-truong?loginError=1" });
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setMe(null);
  }, []);

  const update = useCallback(async (d: { nickname: string; className?: string }) => {
    const r = await updateMe(d);
    setMe(r.user);
  }, []);

  return <Ctx.Provider value={{ me, ready, googleEnabled, signIn, signOut, update }}>{children}</Ctx.Provider>;
}
