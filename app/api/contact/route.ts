import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { createInquiry, sendInquiryNotificationEmail } from "@/lib/inquiries";
import { saveInquiryAttachment, UploadError } from "@/lib/uploads";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomId } from "@/lib/utils";

const MIN_FILL_TIME_MS = 1500; // real users take at least this long to fill the form
const MAX_ATTACHMENTS = 5;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const { allowed } = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid form submission." }, { status: 400 });
  }

  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    company: formData.get("company")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    service: formData.get("service")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    timeline: formData.get("timeline")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
    renderedAt: formData.get("renderedAt")?.toString() ?? "",
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Please correct the highlighted fields.", fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot — silently accept (to not tip off bots) but never persist or notify.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  // Minimum fill-time spam check.
  if (data.renderedAt && Date.now() - data.renderedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: true });
  }

  const inquiryId = randomId("inq");
  const files = formData.getAll("attachments").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_ATTACHMENTS) {
    return NextResponse.json(
      { ok: false, message: `Please attach no more than ${MAX_ATTACHMENTS} files.` },
      { status: 400 }
    );
  }

  const attachmentPaths: string[] = [];
  for (const file of files) {
    try {
      const { url } = await saveInquiryAttachment(inquiryId, file);
      attachmentPaths.push(url);
    } catch (err) {
      if (err instanceof UploadError) {
        return NextResponse.json({ ok: false, message: err.message }, { status: 400 });
      }
      console.error("Attachment upload failed", err);
      return NextResponse.json(
        { ok: false, message: "We couldn't process one of the attached files." },
        { status: 500 }
      );
    }
  }

  try {
    const inquiry = createInquiry(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        category: data.category,
        service: data.service,
        location: data.location,
        timeline: data.timeline,
        description: data.description,
      },
      attachmentPaths,
      ip
    );

    // Best-effort email notification; the inquiry is already saved regardless of outcome.
    await sendInquiryNotificationEmail(inquiry);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save inquiry", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong while submitting your request. Please try again." },
      { status: 500 }
    );
  }
}
