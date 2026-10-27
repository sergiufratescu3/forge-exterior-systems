/**
 * OPTIONAL demo content seeder — OFF by default.
 *
 * The public galleries are designed to show an honest empty state until
 * real projects are published, per the project requirements ("never show
 * fake completed work as real company work"). Run this script only if you
 * want to see the gallery, filters, and project detail pages populated
 * before you've uploaded real project photography.
 *
 * Every project this script creates is clearly labeled "[DEMO]" in its
 * title and description, and its photographs are stock/demonstration
 * images, not real completed work. Delete these projects from /admin
 * whenever you're ready to go live with real project content.
 *
 * Usage: npm run seed:demo
 */
import readline from "node:readline";
import { createProject, addProjectImage } from "../lib/projects";
import { toSlug } from "../lib/utils";

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1800&auto=format&fit=crop",
];

const demoProjects = [
  {
    title: "[DEMO] Maple Ridge Residence",
    category: "residential" as const,
    projectType: "Single-Family Home",
    location: "Maple Ridge (sample location)",
    services: ["siding", "windows"],
    description:
      "Demonstration content only — not a real completed project. Replace or delete this entry from the admin dashboard once you publish real project photography.",
    images: [DEMO_PHOTOS[0], DEMO_PHOTOS[1], DEMO_PHOTOS[2]],
  },
  {
    title: "[DEMO] Birchwood Lane Exterior Refresh",
    category: "residential" as const,
    projectType: "Custom Home",
    location: "Birchwood Lane (sample location)",
    services: ["windows"],
    description:
      "Demonstration content only — not a real completed project. Replace or delete this entry from the admin dashboard once you publish real project photography.",
    images: [DEMO_PHOTOS[3], DEMO_PHOTOS[4]],
  },
  {
    title: "[DEMO] Harbor District Retail Storefront",
    category: "commercial" as const,
    projectType: "Retail Storefront",
    location: "Harbor District (sample location)",
    services: ["storefronts"],
    description:
      "Demonstration content only — not a real completed project. Replace or delete this entry from the admin dashboard once you publish real project photography.",
    images: [DEMO_PHOTOS[5], DEMO_PHOTOS[7]],
  },
  {
    title: "[DEMO] Westline Office Park Facade",
    category: "commercial" as const,
    projectType: "Office Building",
    location: "Westline Office Park (sample location)",
    services: ["siding", "storefronts"],
    description:
      "Demonstration content only — not a real completed project. Replace or delete this entry from the admin dashboard once you publish real project photography.",
    images: [DEMO_PHOTOS[6], DEMO_PHOTOS[0]],
  },
];

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(/^y(es)?$/i.test(answer.trim()));
    });
  });
}

async function main() {
  const proceed =
    process.env.FORCE === "1" ||
    (await confirm(
      "This will add 4 clearly-labeled [DEMO] sample projects (with stock photography) to your database. Continue? (y/N): "
    ));

  if (!proceed) {
    console.log("Cancelled. No demo content was added.");
    return;
  }

  for (const demo of demoProjects) {
    const project = createProject({
      title: demo.title,
      slug: toSlug(demo.title),
      category: demo.category,
      projectType: demo.projectType,
      location: demo.location,
      services: demo.services as ("siding" | "windows" | "storefronts")[],
      description: demo.description,
      status: "published",
      featured: true,
      completionDate: "",
    });

    demo.images.forEach((url) => {
      addProjectImage(project.id, url, `${demo.title} — demonstration photograph`);
    });

    console.log(`✔ Created demo project: ${project.title} (/projects/${project.slug})`);
  }

  console.log(
    "\nDone. Visit /residential-projects and /commercial-projects to see them, or /admin to remove them later."
  );
}

main().catch((err) => {
  console.error("Failed to seed demo content:", err);
  process.exit(1);
});
