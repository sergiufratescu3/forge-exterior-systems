import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deleteProjectImageRow, getProjectById, setCoverImage } from "@/lib/projects";
import { deleteProjectImageFile } from "@/lib/uploads";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  const project = getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  }

  const image = getDb()
    .prepare("SELECT * FROM project_images WHERE id = ? AND project_id = ?")
    .get(params.imageId, params.id) as { url: string } | undefined;

  if (!image) {
    return NextResponse.json({ ok: false, message: "Image not found." }, { status: 404 });
  }

  deleteProjectImageRow(params.imageId, params.id);
  await deleteProjectImageFile(image.url);

  return NextResponse.json({ ok: true, project: getProjectById(params.id) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  const project = getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.setCover) {
    return NextResponse.json({ ok: false, message: "Nothing to update." }, { status: 400 });
  }

  const belongs = project.images.some((img) => img.id === params.imageId);
  if (!belongs) {
    return NextResponse.json({ ok: false, message: "Image not found." }, { status: 404 });
  }

  setCoverImage(params.id, params.imageId);
  return NextResponse.json({ ok: true, project: getProjectById(params.id) });
}
