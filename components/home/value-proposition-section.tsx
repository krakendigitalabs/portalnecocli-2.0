import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { CommercialHomeContent } from "@/types/commercial-content";

type ValuePropositionSectionProps = {
  content: CommercialHomeContent["valueProposition"];
};

export function ValuePropositionSection({
  content,
}: ValuePropositionSectionProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {content.points.map((point) => (
          <Card
            key={point.title}
            className="rounded-[28px] border-ink/10 p-6 transition hover:-translate-y-0.5"
          >
            <h3 className="text-xl font-semibold tracking-tight text-ink">
              {point.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              {point.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
