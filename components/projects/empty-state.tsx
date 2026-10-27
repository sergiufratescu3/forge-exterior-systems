export function ProjectsEmptyState({
  category,
}: {
  category: "residential" | "commercial";
}) {
  return (
    <div className="border border-dashed border-concrete bg-cream/60 py-20 px-6 text-center">
      <p className="label-eyebrow mb-3">Coming soon</p>
      <h3 className="font-heading font-bold text-2xl text-ink max-w-md mx-auto">
        {category === "residential"
          ? "Residential project photography is on the way."
          : "Commercial project photography is on the way."}
      </h3>
      <p className="mt-3 text-slate max-w-md mx-auto">
        No {category} projects have been published yet. New work is added through
        the project dashboard as it is completed — check back soon.
      </p>
    </div>
  );
}
