/**
 * Creates (or updates the password for) an administrator account that can
 * sign in to /admin.
 *
 * Usage:
 *   npm run create-admin
 *   npm run create-admin -- --email you@example.com --password "a strong password"
 *
 * Non-interactive (e.g. CI/deploy scripts) via environment variables:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD="a strong password" npm run create-admin
 */
import readline from "node:readline";
import { upsertAdminUser } from "../lib/admin-users";

function parseArgs(): { email?: string; password?: string } {
  const args = process.argv.slice(2);
  const result: { email?: string; password?: string } = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email") result.email = args[++i];
    if (args[i] === "--password") result.password = args[++i];
  }
  return result;
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const args = parseArgs();

  const email = args.email || process.env.ADMIN_EMAIL || (await prompt("Admin email: "));
  const password =
    args.password || process.env.ADMIN_PASSWORD || (await prompt("Admin password (min 8 characters): "));

  if (!email || !email.includes("@")) {
    console.error("A valid email address is required.");
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const user = upsertAdminUser(email, password);
  console.log(`\n✔ Admin account ready: ${user.email}`);
  console.log("You can now sign in at /admin/login with this email and password.\n");
}

main().catch((err) => {
  console.error("Failed to create admin account:", err);
  process.exit(1);
});
