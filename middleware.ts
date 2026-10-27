import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

/**
 * Protects every /admin page and /api/admin/* route behind a valid admin
 * session cookie. Runs on the Edge runtime, so it verifies the JWT directly
 * with `jose` rather than importing lib/auth.ts (which also pulls in
 * better-sqlite3, a native module that cannot run on the Edge runtime).
 */

const SESSION_COOKIE = "forge_admin_session";
const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const PUBLIC_API_PATHS = ["/api/admin/login"];

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    if (PUBLIC_API_PATHS.includes(pathname)) return NextResponse.next();
    const valid = await hasValidSession(req);
    if (!valid) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) return NextResponse.next();
    const valid = await hasValidSession(req);
    if (!valid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
