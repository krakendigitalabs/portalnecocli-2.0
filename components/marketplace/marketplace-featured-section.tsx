import { FeaturedBusinessGrid } from "@/components/marketplace/featured-business-grid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { FeaturedBusiness } from "@/types/featured-business";

type MarketplaceFeaturedSectionProps = {
  businesses: FeaturedBusiness[];
  ctaHref: string;
  ctaLabel: string;
  description: string;
  eyebrow: string;
  title: string;
};

export function MarketplaceFeaturedSection({
  businesses,
  ctaHref,
  ctaLabel,
  description,
  eyebrow,
  title,
}: MarketplaceFeaturedSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader description={description} eyebrow={eyebrow} title={title} />
        <Button href={ctaHref} size="lg" variant="secondary">
          {ctaLabel}
        </Button>
      </div>

      {businesses.length > 0 ? (
        <FeaturedBusinessGrid businesses={businesses} />
      ) : (
        <Card className="rounded-[30px] border-ink/10 p-8">
          <p className="text-base leading-7 text-ink/72">
            Aun no hay resultados destacados visibles en esta vertical.
          </p>
        </Card>
      )}
    </section>
  );
}
