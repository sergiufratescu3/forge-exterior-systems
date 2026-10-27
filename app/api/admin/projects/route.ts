import { NextRequest, NextResponse } from "next/server";
import { projectInputSchema } from "@/lib/validation";
import { createProject, isSlugTaken } from "@/lib/projects";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = projectInputSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Please correct the highlighted fields.", fieldErrors },
      { status: 400 }
    );
  }

  if (isSlugTaken(parsed.data.slug)) {
    return NextResponse.json(
      {
        ok: false,
        message: "That URL slug is already in use by another project.",
        fieldErrors: { slug: "This slug is already in use." },
      },
      { status: 409 }
    );
  }

  const project = createProject(parsed.data);
  return NextResponse.json({ ok: true, project });
}
