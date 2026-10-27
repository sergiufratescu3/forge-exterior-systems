import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { randomId } from "./utils";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB per image
const MAX_FILES_PER_PROJECT = 30;
const MAX_IMAGE_WIDTH = 2400;

const UPLOAD_ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "public", "uploads");

export class UploadError extends Error {}

function assertSafeSegment(segment: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(segment)) {
    throw new UploadError("Invalid identifier for upload path.");
  }
}

/**
 * Validates and saves a single uploaded project image to disk, converting it
 * to an optimized WebP file. Returns the public URL path (relative, under
 * /uploads/...) to store in the database.
 */
export async function saveProjectImage(
  projectId: string,
  file: File
): Promise<{ url: string }> {
  assertSafeSegment(projectId);

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError(
      `Unsupported file type "${file.type || "unknown"}". Please upload JPEG, PNG, or WebP images.`
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new UploadError(
      `"${file.name}" is larger than the 8MB limit per image.`
    );
  }

  const dir = path.join(UPLOAD_ROOT, "projects", projectId);
  await fs.mkdir(dir, { recursive: true });

  const existing = await fs.readdir(dir).catch(() => [] as string[]);
  if (existing.length >= MAX_FILES_PER_PROJECT) {
    throw new UploadError(
      `This project already has the maximum of ${MAX_FILES_PER_PROJECT} photographs.`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomId()}.webp`;
  const destPath = path.join(dir, filename);

  await sharp(buffer)
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destPath);

  const url = `/uploads/projects/${projectId}/${filename}`;
  return { url };
}

/** Deletes a single project image file from disk, ignoring missing files. */
export async function deleteProjectImageFile(url: string): Promise<void> {
  if (!url.startsWith("/uploads/projects/")) return;
  const relative = url.replace(/^\//, "");
  const resolved = path.join(process.cwd(), "public", relative);
  // Guard against path traversal — resolved path must stay under UPLOAD_ROOT/projects.
  const projectsRoot = path.join(UPLOAD_ROOT, "projects");
  if (!resolved.startsWith(projectsRoot)) return;
  await fs.unlink(resolved).catch(() => undefined);
}

/** Deletes an entire project's upload directory (used when a project is deleted). */
export async function deleteProjectUploadDir(projectId: string): Promise<void> {
  assertSafeSegment(projectId);
  const dir = path.join(UPLOAD_ROOT, "projects", projectId);
  await fs.rm(dir, { recursive: true, force: true });
}

/** Saves an optional contact-form attachment (image or PDF) and returns its public URL. */
export async function saveInquiryAttachment(
  inquiryId: string,
  file: File
): Promise<{ url: string }> {
  assertSafeSegment(inquiryId);

  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
  if (!allowed.has(file.type)) {
    throw new UploadError(
      "Attachments must be a JPEG, PNG, WebP image, or PDF file."
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new UploadError("Attachments must be 8MB or smaller.");
  }

  const dir = path.join(UPLOAD_ROOT, "inquiries", inquiryId);
  await fs.mkdir(dir, { recursive: true });

  const ext = file.type === "application/pdf" ? "pdf" : "webp";
  const filename = `${randomId()}.${ext}`;
  const destPath = path.join(dir, filename);

  if (file.type === "application/pdf") {
    await fs.writeFile(destPath, Buffer.from(await file.arrayBuffer()));
  } else {
    const buffer = Buffer.from(await file.arrayBuffer());
    await sharp(buffer)
      .rotate()
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destPath);
  }

  return { url: `/uploads/inquiries/${inquiryId}/${filename}` };
}

export const uploadLimits = {
  MAX_FILE_BYTES,
  MAX_FILES_PER_PROJECT,
};
