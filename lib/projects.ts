// Note: no `import "server-only"` here — this module is also imported
// directly by scripts/seed-demo.ts, which runs under plain Node (tsx), not
// inside Next.js's React Server Component graph. The native better-sqlite3
// dependency already makes this module unusable from a client/browser bundle.
import { getDb } from "./db";
import { randomId } from "./utils";
import type { ProjectInput } from "./validation";

export type ProjectCategory = "residential" | "commercial";
export type ProjectStatus = "draft" | "published";

export type ProjectImage = {
  id: string;
  project_id: string;
  url: string;
  alt_text: string;
  sort_order: number;
};

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  project_type: string;
  location: string;
  services: string; // JSON-encoded string[]
  description: string;
  cover_image_id: string | null;
  status: ProjectStatus;
  featured: number;
  completion_date: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Project = Omit<ProjectRow, "services" | "featured"> & {
  services: string[];
  featured: boolean;
  images: ProjectImage[];
  coverImage: ProjectImage | null;
};

function hydrate(row: ProjectRow, images: ProjectImage[]): Project {
  let services: string[] = [];
  try {
    services = JSON.parse(row.services);
  } catch {
    services = [];
  }
  const coverImage =
    images.find((img) => img.id === row.cover_image_id) ?? images[0] ?? null;

  return {
    ...row,
    services,
    featured: Boolean(row.featured),
    images,
    coverImage,
  };
}

function getImagesForProject(projectId: string): ProjectImage[] {
  return getDb()
    .prepare(
      "SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order ASC, created_at ASC"
    )
    .all(projectId) as ProjectImage[];
}

export function getAllProjectsAdmin(): Project[] {
  const rows = getDb()
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all() as ProjectRow[];
  return rows.map((row) => hydrate(row, getImagesForProject(row.id)));
}

export function getProjectById(id: string): Project | null {
  const row = getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | ProjectRow
    | undefined;
  if (!row) return null;
  return hydrate(row, getImagesForProject(row.id));
}

export function getProjectBySlug(
  slug: string,
  opts: { includeDrafts?: boolean } = {}
): Project | null {
  const row = getDb().prepare("SELECT * FROM projects WHERE slug = ?").get(slug) as
    | ProjectRow
    | undefined;
  if (!row) return null;
  if (row.status !== "published" && !opts.includeDrafts) return null;
  return hydrate(row, getImagesForProject(row.id));
}

export function getPublishedProjects(category?: ProjectCategory): Project[] {
  const db = getDb();
  const rows = category
    ? (db
        .prepare(
          "SELECT * FROM projects WHERE status = 'published' AND category = ? ORDER BY sort_order ASC, created_at DESC"
        )
        .all(category) as ProjectRow[])
    : (db
        .prepare(
          "SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC"
        )
        .all() as ProjectRow[]);
  return rows.map((row) => hydrate(row, getImagesForProject(row.id)));
}

export function getFeaturedProjects(category: ProjectCategory, limit = 3): Project[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM projects
       WHERE status = 'published' AND category = ?
       ORDER BY featured DESC, sort_order ASC, created_at DESC
       LIMIT ?`
    )
    .all(category, limit) as ProjectRow[];
  return rows.map((row) => hydrate(row, getImagesForProject(row.id)));
}

/** Projects that include a given service tag among published projects (any category, or filtered). */
export function getPublishedProjectsByService(
  serviceKey: string,
  category?: ProjectCategory,
  limit = 6
): Project[] {
  const all = category ? getPublishedProjects(category) : getPublishedProjects();
  return all.filter((p) => p.services.includes(serviceKey)).slice(0, limit);
}

export function isSlugTaken(slug: string, excludeId?: string): boolean {
  const db = getDb();
  const row = excludeId
    ? db
        .prepare("SELECT id FROM projects WHERE slug = ? AND id != ?")
        .get(slug, excludeId)
    : db.prepare("SELECT id FROM projects WHERE slug = ?").get(slug);
  return Boolean(row);
}

export function createProject(input: ProjectInput): Project {
  const db = getDb();
  const id = randomId("proj");
  db.prepare(
    `INSERT INTO projects
      (id, title, slug, category, project_type, location, services, description, status, featured, completion_date)
     VALUES (@id, @title, @slug, @category, @project_type, @location, @services, @description, @status, @featured, @completion_date)`
  ).run({
    id,
    title: input.title,
    slug: input.slug,
    category: input.category,
    project_type: input.projectType ?? "",
    location: input.location ?? "",
    services: JSON.stringify(input.services),
    description: input.description ?? "",
    status: input.status,
    featured: input.featured ? 1 : 0,
    completion_date: input.completionDate ?? "",
  });
  return getProjectById(id)!;
}

export function updateProject(id: string, input: ProjectInput): Project | null {
  const db = getDb();
  db.prepare(
    `UPDATE projects SET
      title = @title,
      slug = @slug,
      category = @category,
      project_type = @project_type,
      location = @location,
      services = @services,
      description = @description,
      status = @status,
      featured = @featured,
      completion_date = @completion_date,
      updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id,
    title: input.title,
    slug: input.slug,
    category: input.category,
    project_type: input.projectType ?? "",
    location: input.location ?? "",
    services: JSON.stringify(input.services),
    description: input.description ?? "",
    status: input.status,
    featured: input.featured ? 1 : 0,
    completion_date: input.completionDate ?? "",
  });
  return getProjectById(id);
}

export function setProjectStatus(id: string, status: ProjectStatus) {
  getDb()
    .prepare("UPDATE projects SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .run(status, id);
}

export function deleteProjectRow(id: string) {
  // ON DELETE CASCADE removes associated project_images rows.
  getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
}

// ---------------------------------------------------------------------------
// Project images
// ---------------------------------------------------------------------------

export function addProjectImage(
  projectId: string,
  url: string,
  altText = ""
): ProjectImage {
  const db = getDb();
  const id = randomId("img");
  const maxOrder = db
    .prepare(
      "SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM project_images WHERE project_id = ?"
    )
    .get(projectId) as { maxOrder: number };

  db.prepare(
    "INSERT INTO project_images (id, project_id, url, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)"
  ).run(id, projectId, url, altText, maxOrder.maxOrder + 1);

  // If this project has no cover image yet, set this one as cover.
  const project = db
    .prepare("SELECT cover_image_id FROM projects WHERE id = ?")
    .get(projectId) as { cover_image_id: string | null } | undefined;
  if (project && !project.cover_image_id) {
    db.prepare("UPDATE projects SET cover_image_id = ? WHERE id = ?").run(id, projectId);
  }

  return { id, project_id: projectId, url, alt_text: altText, sort_order: maxOrder.maxOrder + 1 };
}

export function deleteProjectImageRow(imageId: string, projectId: string) {
  const db = getDb();
  db.prepare("DELETE FROM project_images WHERE id = ? AND project_id = ?").run(
    imageId,
    projectId
  );

  // If the deleted image was the cover, promote the next available image.
  const project = db
    .prepare("SELECT cover_image_id FROM projects WHERE id = ?")
    .get(projectId) as { cover_image_id: string | null } | undefined;
  if (project && project.cover_image_id === imageId) {
    const next = db
      .prepare(
        "SELECT id FROM project_images WHERE project_id = ? ORDER BY sort_order ASC LIMIT 1"
      )
      .get(projectId) as { id: string } | undefined;
    db.prepare("UPDATE projects SET cover_image_id = ? WHERE id = ?").run(
      next?.id ?? null,
      projectId
    );
  }
}

export function setCoverImage(projectId: string, imageId: string) {
  getDb()
    .prepare("UPDATE projects SET cover_image_id = ? WHERE id = ?")
    .run(imageId, projectId);
}

/** Reorders images for a project given an ordered array of image IDs. */
export function reorderProjectImages(projectId: string, orderedImageIds: string[]) {
  const db = getDb();
  const update = db.prepare(
    "UPDATE project_images SET sort_order = ? WHERE id = ? AND project_id = ?"
  );
  const tx = db.transaction((ids: string[]) => {
    ids.forEach((imgId, index) => update.run(index, imgId, projectId));
  });
  tx(orderedImageIds);
}

/** Distinct service keys present among published projects of a category (for working filters). */
export function getAvailableServiceFilters(category: ProjectCategory): string[] {
  const projects = getPublishedProjects(category);
  const set = new Set<string>();
  projects.forEach((p) => p.services.forEach((s) => set.add(s)));
  return Array.from(set);
}

/** Previous/next published project within the same category, ordered the same way as the gallery. */
export function getAdjacentProjects(
  current: Project
): { prev: Project | null; next: Project | null } {
  const all = getPublishedProjects(current.category);
  const index = all.findIndex((p) => p.id === current.id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}
