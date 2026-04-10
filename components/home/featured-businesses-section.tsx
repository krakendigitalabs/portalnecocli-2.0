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
    <section className="space-y-6 md:space-y-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Comercios destacados"
            title="Explora negocios en Necoclí con accesos claros y una presentación lista para convertir."
            description="Una capa premium para descubrir hospedaje, gastronomía, tours, transporte y comercios aliados con CTAs directos, información clave y fichas listas para crecer."
          />
          <p className="max-w-2xl text-sm leading-7 text-ink/70">
            Entra al directorio para comparar categorías, abrir WhatsApp, llamar o ver la ficha de cada negocio sin salir del flujo.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="w-full sm:w-auto" href="/negocios" size="lg">
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
