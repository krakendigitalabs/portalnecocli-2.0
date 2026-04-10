import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { getServiceTypeLabel } from "@/lib/utils/business-links";
import type { BusinessServiceType } from "@/types/featured-business";

type BusinessCategoryBadgeProps = {
  category: string;
  serviceType: BusinessServiceType;
  className?: string;
};

const badgeToneByServiceType: Record<BusinessServiceType, string> = {
  hotel: "bg-coral/10 text-coral",
  restaurante: "bg-teal/10 text-teal",
  comercio: "bg-ink/6 text-ink/74",
  transporte: "bg-sand text-ink",
  turismo: "bg-teal/12 text-teal",
  domicilios: "bg-coral/12 text-coral",
};

export function BusinessCategoryBadge({
  category,
  serviceType,
  className,
}: BusinessCategoryBadgeProps) {
  return (
    <Badge
      className={cn(
        badgeToneByServiceType[serviceType],
        "gap-2 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]",
        className,
      )}
      variant="neutral"
    >
      <span>{getServiceTypeLabel(serviceType)}</span>
      <span className="hidden text-ink/45 sm:inline">/</span>
      <span className="hidden normal-case tracking-normal sm:inline">{category}</span>
    </Badge>
  );
}
