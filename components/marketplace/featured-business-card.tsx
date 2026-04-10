import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BusinessAccessLinks } from "@/components/marketplace/business-access-links";
import { BusinessCategoryBadge } from "@/components/marketplace/business-category-badge";
import { BusinessCTAGroup } from "@/components/marketplace/business-cta-group";
import type { FeaturedBusiness } from "@/types/featured-business";

type FeaturedBusinessCardProps = {
  business: FeaturedBusiness;
};

export function FeaturedBusinessCard({ business }: FeaturedBusinessCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-[32px] border-ink/10">
      <Link href={`/negocios/${business.slug}`} className="block">
        <div className="aspect-[1.2/1] overflow-hidden bg-sand">
          <img
            alt={business.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
            src={business.image}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="space-y-4">
          <BusinessCategoryBadge
            category={business.category}
            serviceType={business.serviceType}
          />
          <div>
            <Link href={`/negocios/${business.slug}`}>
              <h3 className="text-2xl font-semibold tracking-tight text-ink transition hover:text-teal">
                {business.name}
              </h3>
            </Link>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              {business.shortDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {business.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-ink/6 px-3 py-1.5 text-xs font-medium text-ink/72"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <BusinessAccessLinks business={business} />
        <div className="mt-auto">
          <BusinessCTAGroup business={business} compact />
        </div>
      </div>
    </Card>
  );
}
