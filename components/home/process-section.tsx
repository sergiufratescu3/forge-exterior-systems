import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { demoImages } from "@/lib/demo-images";

const steps = [
  {
    title: "INITIAL INQUIRY",
    description: "Tell us about your project, location, and the services you need.",
  },
  {
    title: "PROJECT REVIEW",
    description: "We review the project scope, available information, and next steps.",
  },
  {
    title: "PLANNING AND INSTALLATION",
    description: "Coordinate the work according to the agreed project requirements and schedule.",
  },
  {
    title: "FINAL REVIEW",
    description: "Review the completed installation and address applicable project closeout items.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div>
            <SectionHeading eyebrow="HOW WE WORK" title="A CLEAR PROCESS FROM START TO FINISH" />
            <div className="relative aspect-[4/3] mt-10 bg-concrete hidden lg:block">
              <Image
                src={demoImages.processPlanning.src}
                alt={demoImages.processPlanning.alt}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </div>
          <ol className="space-y-10">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-6">
                <span className="font-heading font-extrabold text-2xl text-concrete leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pb-8 border-b border-concrete flex-1">
                  <h3 className="font-heading font-bold text-lg text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate leading-relaxed">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
