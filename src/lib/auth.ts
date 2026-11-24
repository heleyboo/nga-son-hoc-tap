import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/db";
import { account, session, user, verification } from "@/db/schema";

/**
 * Đăng nhập Google bằng better-auth, lưu user/session trong SQLite.
 *
 * Biến môi trường:
 *   BETTER_AUTH_SECRET     chuỗi ngẫu nhiên ≥ 32 ký tự (bắt buộc ở production)
 *   BETTER_AUTH_URL        URL gốc, vd https://hoctap.ngason.edu.vn
 *   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
 *   GOOGLE_ALLOWED_DOMAIN  (tùy chọn) chỉ cho phép email thuộc tên miền này, vd "ngason.edu.vn"
 *   TEACHER_EMAILS         email giáo viên, cách nhau bởi dấu phẩy (được vào trang /giao-vien)
 */
export const googleEnabled = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const allowedDomain = () => process.env.GOOGLE_ALLOWED_DOMAIN?.trim().toLowerCase() || "";

function createAuth() {
  const domain = allowedDomain();
  return betterAuth({
    appName: "Đấu Trường Tri Thức",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), { provider: "sqlite", schema: { user, session, account, verification } }),
    socialProviders: googleEnabled()
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            prompt: "select_account",
            ...(domain ? { hd: domain } : {}),
            // Mặc định hiển thị tên gọi (given_name) thay vì họ tên đầy đủ — bớt lộ thông tin học sinh
            mapProfileToUser: (p) => ({ nickname: (p.given_name || p.name || "").slice(0, 24) }),
          },
        }
      : {},
    user: {
      additionalFields: {
        nickname: { type: "string", required: false, input: false },
        className: { type: "string", required: false, input: false },
        role: { type: "string", required: false, input: false, defaultValue: "student" },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 ngày
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
    databaseHooks: {
      user: {
        create: {
          // hd chỉ là gợi ý cho màn chọn tài khoản Google → kiểm tra lại ở server
          before: async (u) => {
            if (domain && !u.email.toLowerCase().endsWith(`@${domain}`)) return false;
            return { data: u };
          },
        },
      },
    },
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;
const g = globalThis as unknown as { __auth?: Auth };

/** Khởi tạo lười để không mở DB lúc build */
export function getAuth(): Auth {
  g.__auth ??= createAuth();
  return g.__auth;
}

export type SessionUser = {
  id: string; name: string; nickname: string; className: string | null; image: string | null;
  /** giáo viên: role = "teacher" trong DB hoặc email nằm trong TEACHER_EMAILS */
  isTeacher: boolean;
};

/** Danh sách email giáo viên (TEACHER_EMAILS, cách nhau bởi dấu phẩy) */
export function isTeacherEmail(email: string) {
  const list = (process.env.TEACHER_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.trim().toLowerCase());
}

/** Đọc người dùng hiện tại từ header của request (Route Handler) */
export async function getSessionUser(headers: Headers): Promise<SessionUser | null> {
  if (!googleEnabled()) return null;
  const s = await getAuth().api.getSession({ headers });
  if (!s) return null;
  const u = s.user as typeof s.user & { nickname?: string | null; className?: string | null; role?: string | null };
  return {
    id: u.id,
    name: u.name,
    nickname: u.nickname || u.name.split(" ").slice(-1)[0] || "Bạn",
    className: u.className ?? null,
    image: u.image ?? null,
    isTeacher: u.role === "teacher" || isTeacherEmail(u.email),
  };
}
