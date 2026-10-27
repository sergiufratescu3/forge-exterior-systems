"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { contactFormSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, string>;

const serviceOptions = [
  { value: "", label: "Select a service" },
  { value: "siding", label: "Siding" },
  { value: "windows", label: "Windows" },
  { value: "storefronts", label: "Commercial Storefronts" },
  { value: "multiple", label: "Multiple Services" },
];

const categoryOptions = [
  { value: "", label: "Select a category" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
];

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink mb-2">
        {label} {required && <span className="text-copper">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full border border-concrete bg-white px-4 py-3 text-ink placeholder:text-slate/60 focus:outline-none focus:border-ink transition-colors duration-250";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [renderedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  function validateClientSide(formData: FormData): FieldErrors {
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
    };
    const parsed = contactFormSchema.safeParse(raw);
    if (parsed.success) return {};
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fieldErrors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const clientErrors = validateClientSide(formData);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    setServerMessage("");
    formData.set("renderedAt", String(renderedAt));

    try {
      const res = await fetch("/api/contact", { method: "POST", body: formData });
      const json = await res.json();

      if (res.ok && json.ok) {
        setStatus("success");
        formRef.current.reset();
      } else {
        setStatus("error");
        setServerMessage(json.message || "Something went wrong. Please try again.");
        if (json.fieldErrors) setErrors(json.fieldErrors);
      }
    } catch {
      setStatus("error");
      setServerMessage("We couldn't reach the server. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-concrete bg-cream p-8 sm:p-10 text-center">
        <p className="label-eyebrow mb-3">Thank you</p>
        <h3 className="font-heading font-bold text-2xl text-ink">
          Your project inquiry has been submitted.
        </h3>
        <p className="mt-3 text-slate max-w-md mx-auto leading-relaxed">
          Our team will review the information and follow up using the
          contact details you provided.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot field — hidden from real users via CSS, left blank by them, often filled by bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Full Name" htmlFor="name" required error={errors.name}>
          <input id="name" name="name" type="text" required className={inputClass} />
        </Field>
        <Field label="Email Address" htmlFor="email" required error={errors.email}>
          <input id="email" name="email" type="email" required className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Phone Number" htmlFor="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" className={inputClass} />
        </Field>
        <Field label="Company Name" htmlFor="company" error={errors.company}>
          <input id="company" name="company" type="text" className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Project Category" htmlFor="category" error={errors.category}>
          <select id="category" name="category" className={inputClass}>
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Service Required" htmlFor="service" error={errors.service}>
          <select id="service" name="service" className={inputClass}>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Project Location" htmlFor="location" required error={errors.location}>
          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="City / neighborhood / address"
            className={inputClass}
          />
        </Field>
        <Field label="Estimated Timeline" htmlFor="timeline" error={errors.timeline}>
          <input
            id="timeline"
            name="timeline"
            type="text"
            placeholder="e.g. Within 3 months"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Project Description" htmlFor="description" required error={errors.description}>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Tell us about the scope of work, building type, and any details that would help us understand the project."
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <Field label="Attachments (optional)" htmlFor="attachments" error={errors.attachments}>
        <input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="w-full border border-concrete bg-white px-4 py-3 text-sm text-slate file:mr-4 file:border-0 file:bg-ink file:text-cream file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wide"
        />
        <p className="mt-1.5 text-xs text-slate">
          JPEG, PNG, WebP, or PDF — up to 8MB each, 5 files maximum.
        </p>
      </Field>

      {status === "error" && serverMessage && (
        <p className="text-sm text-red-700" role="alert">
          {serverMessage}
        </p>
      )}

      <Button type="submit" size="lg" variant="primary" disabled={status === "submitting"}>
        {status === "submitting" ? "SUBMITTING…" : "SUBMIT PROJECT INQUIRY"}
      </Button>
    </form>
  );
}
