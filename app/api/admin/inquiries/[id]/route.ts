import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";

const schema = z.object({ status: z.enum(["new", "read"]) });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid status." }, { status: 400 });
  }

  const result = getDb()
    .prepare("UPDATE inquiries SET status = ? WHERE id = ?")
    .run(parsed.data.status, params.id);

  if (result.changes === 0) {
    return NextResponse.json({ ok: false, message: "Inquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
