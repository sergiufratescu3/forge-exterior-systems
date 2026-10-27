import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionCookie, verifyAdminCredentials } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Limit brute-force login attempts per IP.
  const { allowed } = checkRateLimit(`admin-login:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid email or password." }, { status: 400 });
  }

  const user = verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Invalid email or password." }, { status: 401 });
  }

  await createSessionCookie(user);
  return NextResponse.json({ ok: true });
}
