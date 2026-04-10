import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CommercialHomeContent } from "@/types/commercial-content";

type ReservationCtaSectionProps = {
  content: CommercialHomeContent["reservationCta"];
};

export function ReservationCtaSection({
  content,
}: ReservationCtaSectionProps) {
  return (
    <section className="space-y-6">
      <Card className="rounded-[34px] border-0 bg-ink px-6 py-8 text-white shadow-soft md:px-10 md:py-10">
        <Badge className="bg-white/12 text-white" variant="neutral">
          {content.eyebrow}
        </Badge>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {content.title}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-white/74">
              {content.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button href={content.primaryCta.href} size="lg" variant="accent">
              {content.primaryCta.label}
            </Button>
            <Button href={content.secondaryCta.href} size="lg" variant="secondary">
              {content.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
