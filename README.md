# Forge Exterior Systems — Website & Project CMS

A complete, production-ready website for an exterior construction and
installation company (siding, windows, commercial storefronts), built with
Next.js 14 (App Router), TypeScript, and Tailwind CSS. It includes a real,
database-backed content management system with a secure admin dashboard for
publishing residential and commercial project photography — no code changes
required to add new projects.

**Brand name, tagline, colors, and contact details are all placeholders**
until you edit `config/site.ts`. See [Branding & company info](#branding--company-info)
below.

---

## 1. What's actually working

- **Full public website**: Home, Services (+ 3 individual service pages),
  Residential Projects, Commercial Projects, individual project pages,
  About, Contact/Estimate — all with working navigation, responsive layout,
  and real SEO plumbing (sitemap, robots.txt, per-page metadata, Open
  Graph, canonical URLs).
- **Real CMS, not a static array**: projects and their photographs are
  stored in a SQLite database (`data/forge.db`) and uploaded files on disk
  (`public/uploads/`). Publishing a project in `/admin` makes it appear on
  the live site immediately — no deploy or code edit needed.
- **Secure admin dashboard** at `/admin`: password-protected (bcrypt +
  signed session cookie), create/edit/delete projects, draft vs. published
  status, residential/commercial category, multi-photo upload (converted
  to optimized WebP on upload), cover photo selection, reorder, and a
  preview link for unpublished drafts.
- **Working contact form**: client + server validation, honeypot and
  minimum-fill-time spam checks, per-IP rate limiting, saved to the
  database, viewable at `/admin/inquiries`, with optional email
  notifications via Resend.
- **Everything above has been exercised end-to-end** against a running
  build (login, create project, upload real images, reorder, set cover,
  publish, confirm it appears in the correct public gallery and the
  homepage preview, unpublish, delete, submit the contact form, confirm
  spam protections drop fake submissions) — not just written and assumed
  to work.

This repository ships with an **empty database** — no fake projects are
shown as real completed work. The public galleries show an honest "coming
soon" empty state until you publish real projects.

---

## 2. Quick start (local development)

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and set `SESSION_SECRET` to a long random string:

```bash
openssl rand -base64 32
```

Paste the output as `SESSION_SECRET=...` in `.env.local`.

Create your admin login:

```bash
npm run create-admin
```

You'll be prompted for an email and password (8+ characters). You can also
pass them non-interactively: `npm run create-admin -- --email you@example.com --password "a strong password"`.

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login`
to sign in with the credentials you just created.

### See the galleries populated (optional)

The site intentionally starts with zero projects. If you want to see the
grid, filters, and project detail pages working before you upload real
photography, run:

```bash
npm run seed:demo
```

This adds 4 projects clearly titled `[DEMO] ...` with stock photography,
each one labeled in its own description as demonstration content, not real
completed work. **Delete them from `/admin` before launching publicly** —
they exist only so you can see the CMS working end-to-end.

---

## 3. Environment variables

See `.env.example` for the full list with comments. Summary:

| Variable | Required | Purpose |
|---|---|---|
| `SESSION_SECRET` | **Yes** | Signs admin session cookies. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_SITE_URL` | **Yes** (for production) | Used for the sitemap, canonical URLs, and Open Graph tags. |
| `RESEND_API_KEY` | No | Enables email notifications for new contact-form inquiries. |
| `CONTACT_NOTIFICATION_EMAIL` | No | Where inquiry notification emails are sent (requires `RESEND_API_KEY`). |
| `CONTACT_FROM_EMAIL` | No | The "from" address for notification emails. |
| `DATA_DIR` | No | Override where the SQLite database file lives. Defaults to `./data`. |
| `UPLOAD_DIR` | No | Override where uploaded images are stored. Defaults to `./public/uploads`. |

Never commit `.env.local` (it's already in `.gitignore`) and never put real
secrets in `.env.example`.

---

## 4. How the CMS works (database & storage)

- **Database**: SQLite via `better-sqlite3`, stored at `data/forge.db`.
  Tables: `projects`, `project_images`, `inquiries`, `admin_users`. Schema
  and migrations live in `lib/db.ts` and run automatically on first use.
- **File storage**: uploaded photos are validated (JPEG/PNG/WebP only, 8MB
  max per file), converted to optimized WebP, and saved under
  `public/uploads/projects/<project-id>/`. Contact-form attachments go to
  `public/uploads/inquiries/<inquiry-id>/`.
- **Authorization**: every admin API route (`/api/admin/**`) requires a
  valid signed session cookie, enforced in `middleware.ts` (checked before
  the route handler runs) and again in each handler. Public visitors can
  only ever read **published** projects; draft projects 404 for the public
  and are only viewable by a signed-in admin via a `?preview=1` link.
  No service-role key or secret is ever sent to the browser — all database
  and filesystem access happens in server-only code (API routes and server
  components).

### Important deployment limitation

SQLite + local disk storage requires a **persistent, writable filesystem**
and a **single long-running Node process**. This works great on:
- a VPS or dedicated server
- Docker / Docker Compose
- Railway, Render, Fly.io, or similar platforms with persistent volumes

It does **not** work on serverless platforms with ephemeral or read-only
filesystems (for example, Vercel's default serverless functions) — the
database and uploaded files would be wiped on every deploy and wouldn't be
shared across instances.

**If you need to deploy to a serverless platform**, swap the storage layer:
1. Replace `lib/db.ts` with a hosted Postgres client (e.g.
   [Supabase](https://supabase.com) or [Neon](https://neon.tech)) using the
   same table shapes already defined in `lib/db.ts`.
2. Replace `lib/uploads.ts`'s local filesystem calls with uploads to object
   storage (Supabase Storage, S3, or similar), storing the resulting public
   URL in `project_images.url` exactly as it does today.
3. Everything else (`lib/projects.ts`, the admin UI, the public pages) reads
   and writes through those two files only, so no other code needs to
   change.

This repo intentionally ships with the simpler, fully-working local-disk
version so the CMS is genuinely functional out of the box with zero
external accounts or credentials required.

---

## 5. Using the admin dashboard

### Sign in
Go to `/admin/login` and sign in with the credentials from `npm run create-admin`.

### Upload a residential or commercial project
1. From `/admin`, click **+ New Project**.
2. Fill in the title (the URL slug auto-fills — you can edit it), category
   (**Residential** or **Commercial**), project/building type, location,
   the services performed, and a description.
3. Click **Save as Draft**. You'll land on the project's edit page.
4. Under **Photographs**, click **Upload Photographs** and select one or
   more JPEG/PNG/WebP files (8MB max each). They're optimized and saved
   automatically.
5. Use the **↑ / ↓** buttons to reorder photos, and **Set Cover** to choose
   which photo represents the project in grids and previews.
6. Click **Preview Project** to see exactly how it will look live (only
   visible to you while signed in).
7. When ready, click **Publish**. It immediately appears on
   `/residential-projects` or `/commercial-projects`, its own
   `/projects/<slug>` page, and the homepage preview if you checked
   "Feature this project."

### Edit, unpublish, or delete
From `/admin`, every project has **Edit**, **Publish/Unpublish**, and
**Delete** actions. Unpublishing immediately removes it from all public
pages without deleting its content — you can republish later. Deleting is
permanent and removes its photographs from disk; you'll be asked to
confirm.

### Review contact-form inquiries
`/admin/inquiries` lists every submission, newest first, with a "new"/"read"
badge you can toggle. Each entry shows the submitter's details, message,
and any attachments.

---

## 6. Contact form

Submissions are always validated and saved to the database
(`inquiries` table) regardless of any external configuration — nothing is
ever silently dropped on success. To also receive an email for each new
inquiry, sign up for [Resend](https://resend.com), create an API key, and
set `RESEND_API_KEY` and `CONTACT_NOTIFICATION_EMAIL` in `.env.local` (or
your hosting platform's environment variables). If those aren't set, the
form still works — inquiries are simply only visible at `/admin/inquiries`.

Spam protection: a hidden honeypot field, a minimum-fill-time check, and
per-IP rate limiting (5 submissions per 10 minutes). The rate limiter is
in-memory and per-process — fine for a single-instance deployment; see the
comment in `lib/rate-limit.ts` if you scale to multiple instances.

---

## 7. Branding & company info

Everything brand-related is centralized in **`config/site.ts`**:
- `companyName`, `shortName`, `tagline`, `description`
- `contact.phone`, `contact.email`, `contact.serviceArea`, `contact.address`
- `social` links (leave blank to hide a platform from the footer)
- `contactInfoVerified` — set to `true` only once the contact fields above
  are real; this gates whether structured data (JSON-LD) is published, so
  no placeholder business info is ever presented to search engines as fact.

Brand colors are defined in `tailwind.config.ts` (`charcoal`, `ink`,
`cream`, `concrete`, `slate`, `copper`) matching the approved palette, and
mirrored in `config/site.ts` as `brandColors` for any non-Tailwind use.

The logo is a reusable component (`components/ui/logo.tsx`) — a geometric
window/storefront-grid mark plus wordmark, used consistently in the header
and footer. A standalone copy for print/vehicle use is at
`public/brand/forge-mark.svg`.

**Demonstration photography**: every image shown before you upload real
project photos (hero, service sections, about page) comes from
`lib/demo-images.ts` and is sourced from Unsplash, clearly commented as
temporary and never presented as completed company work. Swap the URLs in
that one file to use your own marketing photography; project photography
is managed entirely through `/admin`, never through this file.

---

## 8. Deployment

### Option A — VPS / Docker / Railway / Render / Fly.io (recommended, works as-is)

```bash
npm run build
npm run create-admin   # once, to set up your login
npm run start          # or let your platform run `npm start`
```

Make sure the platform:
- provides a **persistent volume** mounted at the project root (so
  `data/` and `public/uploads/` survive restarts and redeploys)
- sets `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL` as environment variables
- runs a single long-lived instance (not auto-scaled to multiple ephemeral
  containers, unless you've completed the Postgres/object-storage swap
  described in [section 4](#4-how-the-cms-works-database--storage))

### Option B — Serverless (Vercel, etc.)

Complete the database/storage swap described in section 4 first — the
SQLite + local-disk approach does not persist on these platforms. Once
swapped to a hosted Postgres + object storage backend, deployment is a
standard Next.js deploy.

---

## 9. Known simplifications

In the interest of a focused, maintainable codebase, a few choices were
made deliberately simpler than the maximum possible implementation:

- **Image reordering** uses explicit ↑ / ↓ buttons rather than drag-and-drop.
  Functionally equivalent, less JavaScript, fully keyboard-accessible.
- **Rate limiting** is in-memory per-process (see section 6) — appropriate
  for the single-instance deployment this project ships with.
- **No automated test suite** is included; the application was instead
  verified with an extensive manual end-to-end pass against a running
  production build (auth, CRUD, uploads, reorder, cover selection, publish/
  unpublish, deletion + file cleanup, contact form + spam checks — see
  the project history for the exact commands run). Adding Playwright/Vitest
  coverage would be a reasonable next step.
- **Demonstration photography** is hotlinked from Unsplash rather than
  bundled locally, so it depends on normal internet access at runtime (see
  section 7 for how to replace it).

---

## 10. Project structure

```
config/site.ts            Central brand/contact/nav configuration
lib/                       Database, auth, uploads, validation, rate limiting
components/
  layout/                  Header, Footer
  ui/                      Logo, Button, Container, SectionHeading
  home/                    Homepage sections
  services/                Shared service-page template
  projects/                Project card, filterable grid, lightbox gallery
  contact/                 Contact form
  admin/                   Login, project form, image uploader, tables
app/                       Routes (see URL list in the spec / page files)
scripts/                   create-admin, seed-demo CLIs
middleware.ts              Protects /admin and /api/admin/*
data/                      SQLite database (gitignored, created at runtime)
public/uploads/            Uploaded project photos & attachments (gitignored)
```
