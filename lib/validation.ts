import { z } from "zod";

export const categoryEnum = z.enum(["residential", "commercial"]);
export const serviceKeyEnum = z.enum(["siding", "windows", "storefronts"]);
export const statusEnum = z.enum(["draft", "published"]);

export const projectInputSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  category: categoryEnum,
  projectType: z.string().trim().max(120).optional().default(""),
  location: z.string().trim().max(160).optional().default(""),
  services: z.array(serviceKeyEnum).min(1, "Select at least one service"),
  description: z.string().trim().max(4000).optional().default(""),
  status: statusEnum.default("draft"),
  featured: z.boolean().default(false),
  completionDate: z.string().trim().max(40).optional().default(""),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(160),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(160).optional().default(""),
  category: z.enum(["residential", "commercial", ""]).optional().default(""),
  service: z
    .enum(["siding", "windows", "storefronts", "multiple", ""])
    .optional()
    .default(""),
  location: z.string().trim().min(2, "Please share the project location").max(200),
  timeline: z.string().trim().max(160).optional().default(""),
  description: z
    .string()
    .trim()
    .min(10, "Please include a few details about your project")
    .max(4000),
  // Honeypot field — real users never fill this in; bots often do. It is
  // intentionally unrestricted here (no max length) so that a bot filling
  // it still passes schema validation; the route handler checks its value
  // afterward and silently discards the submission without revealing that
  // a honeypot was tripped.
  website: z.string().optional().default(""),
  // Timestamp (ms) the form was rendered, used for a minimum-fill-time spam check.
  renderedAt: z.coerce.number().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
