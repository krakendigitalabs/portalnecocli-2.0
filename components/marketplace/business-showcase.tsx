import { BusinessCard } from "@/components/marketplace/business-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { Business } from "@/types/business";

type BusinessShowcaseProps = {
  businesses: Business[];
};

export function BusinessShowcase({ businesses }: BusinessShowcaseProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Mock data inicial"
        title="Negocios de referencia para el arranque"
        description="Se incluyen datos mínimos tipados para probar catálogos, cards y futuras vistas de detalle sin acoplar todavía una fuente real."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
}
