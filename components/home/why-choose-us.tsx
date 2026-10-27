import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  {
    title: "ATTENTION TO DETAIL",
    description:
      "Careful execution with a focus on alignment, transitions, and finished appearance.",
  },
  {
    title: "QUALITY WORKMANSHIP",
    description:
      "Installation practices focused on a clean, professional result and the requirements of each project.",
  },
  {
    title: "PROJECT COORDINATION",
    description: "Clear communication and coordination throughout the installation process.",
  },
  {
    title: "RESIDENTIAL AND COMMERCIAL CAPABILITY",
    description: "Exterior installation services for homes, retail spaces, and commercial buildings.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-cream">
      <Container>
        <SectionHeading eyebrow="WHY WORK WITH US" title="BUILT AROUND THE DETAILS" align="center" className="mx-auto" />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {values.map((value, i) => (
            <div key={value.title} className="border-t-2 border-ink pt-5">
              <span className="text-xs font-semibold text-copper">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-heading font-bold text-base text-ink leading-snug">
                {value.title}
              </h3>
              <p className="mt-3 text-sm text-slate leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
