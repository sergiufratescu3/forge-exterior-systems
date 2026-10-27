import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { projectInputSchema, statusEnum } from "@/lib/validation";
import {
  deleteProjectRow,
  getProjectById,
  isSlugTaken,
  setProjectStatus,
  updateProject,
} from "@/lib/projects";
import { deleteProjectUploadDir } from "@/lib/uploads";

const statusOnlySchema = z.object({ status: statusEnum });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);

  // Quick status-only toggle (used by the Publish/Unpublish button in the dashboard table).
  if (body && Object.keys(body).length === 1 && "status" in body) {
    const parsedStatus = statusOnlySchema.safeParse(body);
    if (!parsedStatus.success) {
      return NextResponse.json({ ok: false, message: "Invalid status." }, { status: 400 });
    }
    setProjectStatus(params.id, parsedStatus.data.status);
    return NextResponse.json({ ok: true, project: getProjectById(params.id) });
  }

  // Full project update.
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

  if (isSlugTaken(parsed.data.slug, params.id)) {
    return NextResponse.json(
      {
        ok: false,
        message: "That URL slug is already in use by another project.",
        fieldErrors: { slug: "This slug is already in use." },
      },
      { status: 409 }
    );
  }

  const updated = updateProject(params.id, parsed.data);
  return NextResponse.json({ ok: true, project: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  }

  deleteProjectRow(params.id); // cascades to project_images rows
  await deleteProjectUploadDir(params.id); // removes the files from disk

  return NextResponse.json({ ok: true });
}
