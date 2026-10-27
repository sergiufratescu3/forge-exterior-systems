import "server-only";
import { getDb } from "./db";
import { randomId } from "./utils";
import type { ContactFormInput } from "./validation";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  service: string;
  location: string;
  timeline: string;
  description: string;
  attachment_paths: string;
  status: "new" | "read";
  email_sent: number;
  ip_address: string;
  created_at: string;
};

export function createInquiry(
  input: Omit<ContactFormInput, "website" | "renderedAt">,
  attachmentPaths: string[],
  ipAddress: string
): Inquiry {
  const db = getDb();
  const id = randomId("inq");
  db.prepare(
    `INSERT INTO inquiries
      (id, name, email, phone, company, category, service, location, timeline, description, attachment_paths, ip_address)
     VALUES (@id, @name, @email, @phone, @company, @category, @service, @location, @timeline, @description, @attachment_paths, @ip_address)`
  ).run({
    id,
    name: input.name,
    email: input.email,
    phone: input.phone || "",
    company: input.company || "",
    category: input.category || "",
    service: input.service || "",
    location: input.location,
    timeline: input.timeline || "",
    description: input.description,
    attachment_paths: JSON.stringify(attachmentPaths),
    ip_address: ipAddress,
  });

  return db.prepare("SELECT * FROM inquiries WHERE id = ?").get(id) as Inquiry;
}

export function markInquiryEmailSent(id: string) {
  getDb().prepare("UPDATE inquiries SET email_sent = 1 WHERE id = ?").run(id);
}

export function listInquiries(): Inquiry[] {
  return getDb()
    .prepare("SELECT * FROM inquiries ORDER BY created_at DESC")
    .all() as Inquiry[];
}

/**
 * Sends an email notification for a new inquiry via Resend, if configured.
 * Silently no-ops (and the inquiry is still saved to the database) when
 * RESEND_API_KEY / CONTACT_NOTIFICATION_EMAIL are not set — the admin can
 * still review every inquiry from the database-backed source of truth.
 */
export async function sendInquiryNotificationEmail(inquiry: Inquiry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "notifications@forgeexteriorsystems.example";

  if (!apiKey || !toEmail) {
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `New project inquiry — ${inquiry.name}`,
        text: [
          `New inquiry submitted ${inquiry.created_at}`,
          "",
          `Name: ${inquiry.name}`,
          `Email: ${inquiry.email}`,
          `Phone: ${inquiry.phone || "—"}`,
          `Company: ${inquiry.company || "—"}`,
          `Category: ${inquiry.category || "—"}`,
          `Service: ${inquiry.service || "—"}`,
          `Location: ${inquiry.location}`,
          `Timeline: ${inquiry.timeline || "—"}`,
          "",
          "Description:",
          inquiry.description,
        ].join("\n"),
      }),
    });

    if (res.ok) {
      markInquiryEmailSent(inquiry.id);
      return true;
    }
    console.error("Resend API error", res.status, await res.text());
    return false;
  } catch (err) {
    console.error("Failed to send inquiry notification email", err);
    return false;
  }
}
