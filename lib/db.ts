import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/**
 * Persistent SQLite database for projects, project images, inquiries, and
 * admin users. Zero external services required — the database file lives
 * on disk at DATA_DIR/forge.db.
 *
 * IMPORTANT FOR DEPLOYMENT: this relies on a writable, persistent local
 * filesystem. That works on a VPS, Docker container, Railway, Render,
 * Fly.io, or any traditional Node host. It does NOT work on serverless
 * platforms with ephemeral/read-only filesystems (e.g. Vercel's default
 * runtime), because the database file would be reset on every deploy and
 * is not shared across instances. See README.md "Deployment" section for
 * the swap-in path to a hosted Postgres database (e.g. Supabase) if you
 * deploy to a serverless platform.
 */

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "forge.db");

declare global {
  // eslint-disable-next-line no-var
  var __forgeDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('residential','commercial')),
      project_type TEXT DEFAULT '',
      location TEXT DEFAULT '',
      services TEXT NOT NULL DEFAULT '[]',
      description TEXT DEFAULT '',
      cover_image_id TEXT,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
      featured INTEGER NOT NULL DEFAULT 0,
      completion_date TEXT DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS project_images (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      alt_text TEXT DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      company TEXT DEFAULT '',
      category TEXT DEFAULT '',
      service TEXT DEFAULT '',
      location TEXT NOT NULL,
      timeline TEXT DEFAULT '',
      description TEXT NOT NULL,
      attachment_paths TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read')),
      email_sent INTEGER NOT NULL DEFAULT 0,
      ip_address TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_projects_category_status ON projects(category, status);
    CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
    CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id, sort_order);
    CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at);
  `);
}

/** Returns a singleton database connection (cached across hot reloads in dev). */
export function getDb(): Database.Database {
  if (!global.__forgeDb) {
    global.__forgeDb = createConnection();
  }
  return global.__forgeDb;
}
