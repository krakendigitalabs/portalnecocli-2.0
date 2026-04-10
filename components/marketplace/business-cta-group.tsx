import { Button } from "@/components/ui/button";
import type { FeaturedBusiness } from "@/types/featured-business";

type BusinessCTAGroupProps = {
  business: FeaturedBusiness;
  compact?: boolean;
};

export function BusinessCTAGroup({
  business,
  compact = false,
}: BusinessCTAGroupProps) {
  return (
    <div
      className={
        compact ? "flex flex-col gap-2 sm:flex-row" : "flex flex-col gap-3 sm:flex-row"
      }
    >
      <Button
        href={business.ctaPrimaryHref}
        size={compact ? "md" : "lg"}
        variant="primary"
      >
        {business.ctaPrimaryLabel}
      </Button>
      <Button
        href={business.ctaSecondaryHref}
        size={compact ? "md" : "lg"}
        variant="secondary"
      >
        {business.ctaSecondaryLabel}
      </Button>
    </div>
  );
}
