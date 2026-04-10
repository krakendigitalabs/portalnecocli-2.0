import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Business } from "@/types/business";

type BusinessCardProps = {
  business: Business;
};

export function BusinessCard({ business }: BusinessCardProps) {
  const statusLabel = business.status === "active" ? "Activo" : "Borrador";

  return (
    <Card className="rounded-[30px] border-ink/10 p-6 transition hover:-translate-y-0.5 hover:border-teal/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-coral">
            {business.categoryLabel}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-ink">
            {business.name}
          </h3>
        </div>
        <Badge variant={business.status === "active" ? "teal" : "neutral"}>
          {statusLabel}
        </Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-ink/70">{business.summary}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-ink/65">
        <span>{business.location}</span>
        <span>{business.priceRange}</span>
      </div>
    </Card>
  );
}
