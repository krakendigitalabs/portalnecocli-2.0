import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import type { CommercialHomeContent } from "@/types/commercial-content";

type DirectorySectionProps = {
  content: CommercialHomeContent["directorySection"];
};

export function DirectorySection({ content }: DirectorySectionProps) {
  return (
    <section id="directory" className="scroll-mt-32 space-y-6">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {content.listings.map((listing) => (
          <Card
            key={listing.id}
            className="rounded-[30px] border-ink/10 p-6 transition hover:-translate-y-0.5 hover:border-teal/25"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-coral">
                  {listing.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                  {listing.name}
                </h3>
              </div>
              <Badge variant="teal">{listing.priceLabel}</Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              {listing.summary}
            </p>
            <p className="mt-4 text-sm font-medium text-ink/68">
              {listing.location}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-6">
              <Button href={listing.cta.href} size="md">
                {listing.cta.label}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
