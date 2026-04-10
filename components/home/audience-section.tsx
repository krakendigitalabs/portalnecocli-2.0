import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { AudienceSection as AudienceSectionContent } from "@/types/commercial-content";

type AudienceSectionProps = {
  content: AudienceSectionContent;
};

export function AudienceSection({ content }: AudienceSectionProps) {
  return (
    <section id={content.id} className="scroll-mt-32 space-y-6">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {content.steps.map((step, index) => (
          <Card
            key={step.title}
            className="rounded-[28px] border-ink/10 p-6 transition hover:-translate-y-0.5 hover:border-coral/25"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
              Paso {index + 1}
            </p>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              {step.description}
            </p>
            {step.cta ? (
              <div className="mt-5">
                <Button href={step.cta.href} size="md" variant="secondary">
                  {step.cta.label}
                </Button>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}
