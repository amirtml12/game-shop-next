import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "@/lib/auth";

export function getAuthUser(request: NextRequest): TokenPayload | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(
  request: NextRequest
): { ok: true; user: TokenPayload } | { ok: false; response: NextResponse } {
  const user = getAuthUser(request);
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 }),
    };
  }
  if (user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 }),
    };
  }
  return { ok: true, user };
}

// فقط چک می‌کنه کاربر لاگین کرده یا نه (فرقی نداره نقشش چیه)
export function requireUser(
  request: NextRequest
): { ok: true; user: TokenPayload } | { ok: false; response: NextResponse } {
  const user = getAuthUser(request);
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "برای ارسال پیام باید وارد شوید" }, { status: 401 }),
    };
  }
  return { ok: true, user };
}