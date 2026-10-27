import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addProjectImage, getProjectById, reorderProjectImages } from "@/lib/projects";
import { saveProjectImage, UploadError, uploadLimits } from "@/lib/uploads";

const reorderSchema = z.object({
  orderedImageIds: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid upload." }, { status: 400 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return NextResponse.json({ ok: false, message: "No files were uploaded." }, { status: 400 });
  }
  if (project.images.length + files.length > uploadLimits.MAX_FILES_PER_PROJECT) {
    return NextResponse.json(
      {
        ok: false,
        message: `This project can have at most ${uploadLimits.MAX_FILES_PER_PROJECT} photographs.`,
      },
      { status: 400 }
    );
  }

  try {
    for (const file of files) {
      const { url } = await saveProjectImage(params.id, file);
      addProjectImage(params.id, url, `${project.title} — project photograph`);
    }
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ ok: false, message: err.message }, { status: 400 });
    }
    console.error("Image upload failed", err);
    return NextResponse.json({ ok: false, message: "Upload failed. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, project: getProjectById(params.id) });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid reorder request." }, { status: 400 });
  }

  reorderProjectImages(params.id, parsed.data.orderedImageIds);
  return NextResponse.json({ ok: true, project: getProjectById(params.id) });
}
