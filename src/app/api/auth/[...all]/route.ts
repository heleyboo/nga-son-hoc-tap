import { getAuth } from "@/lib/auth";

/** /api/auth/* — better-auth (đăng nhập Google, callback, session, đăng xuất) */
export const GET = (req: Request) => getAuth().handler(req);
export const POST = (req: Request) => getAuth().handler(req);
