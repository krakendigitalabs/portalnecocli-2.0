import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { BusinessHighlightCarousel } from "@/components/marketplace/business-highlight-carousel";
import { FeaturedBusinessGrid } from "@/components/marketplace/featured-business-grid";
import type { FeaturedBusiness } from "@/types/featured-business";

type FeaturedBusinessesSectionProps = {
  businesses: FeaturedBusiness[];
};

export function FeaturedBusinessesSection({
  businesses,
}: FeaturedBusinessesSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Comercios destacados"
          title="Explora negocios en Necocli con accesos claros y una presentacion lista para convertir."
          description="Una capa premium para descubrir hospedaje, gastronomia, tours, transporte y comercios aliados con CTAs directos, informacion clave y fichas listas para crecer."
        />
        <div className="flex gap-3">
          <Button href="/negocios" size="lg">
            Ver todos los negocios
          </Button>
        </div>
      </div>
      <div className="lg:hidden">
        <BusinessHighlightCarousel businesses={businesses} />
      </div>
      <div className="hidden lg:block">
        <FeaturedBusinessGrid businesses={businesses} />
      </div>
    </section>
  );
}
