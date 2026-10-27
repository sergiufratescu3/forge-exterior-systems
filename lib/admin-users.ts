// Note: no `import "server-only"` here — this module is also imported
// directly by scripts/create-admin.ts, which runs under plain Node (tsx),
// not inside Next.js's React Server Component graph where that marker
// package's "react-server" export condition is active. The native
// better-sqlite3 dependency already makes this module unusable from a
// client/browser bundle.
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { randomId } from "./utils";

/**
 * Admin-account database functions with no dependency on Next.js request
 * context (no `next/headers`), so they can be imported from standalone
 * scripts (scripts/create-admin.ts) as well as from server components and
 * route handlers via lib/auth.ts.
 */

export type AdminUser = {
  id: string;
  email: string;
};

export function verifyAdminCredentials(email: string, password: string): AdminUser | null {
  const db = getDb();
  const row = db
    .prepare("SELECT id, email, password_hash FROM admin_users WHERE email = ?")
    .get(email.trim().toLowerCase()) as
    | { id: string; email: string; password_hash: string }
    | undefined;

  if (!row) return null;
  const ok = bcrypt.compareSync(password, row.password_hash);
  if (!ok) return null;
  return { id: row.id, email: row.email };
}

export function adminUserCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM admin_users").get() as {
    count: number;
  };
  return row.count;
}

/** Creates or updates an admin user by email. Used by the create-admin CLI script. */
export function upsertAdminUser(email: string, password: string): AdminUser {
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = bcrypt.hashSync(password, 12);

  const existing = db
    .prepare("SELECT id FROM admin_users WHERE email = ?")
    .get(normalizedEmail) as { id: string } | undefined;

  if (existing) {
    db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(
      passwordHash,
      existing.id
    );
    return { id: existing.id, email: normalizedEmail };
  }

  const id = randomId("admin");
  db.prepare(
    "INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)"
  ).run(id, normalizedEmail, passwordHash);
  return { id, email: normalizedEmail };
}
