import { CategoryCard } from "@/components/marketplace/category-card";
import { MarketplaceFeaturedSection } from "@/components/marketplace/marketplace-featured-section";
import { MarketplaceHomeHero } from "@/components/marketplace/marketplace-home-hero";
import { MarketplaceRegisterCta } from "@/components/marketplace/marketplace-register-cta";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { businessCategories } from "@/data/categories";
import {
  getFeaturedExperiences,
  getFeaturedMarketplaceBusinesses,
  getMarketplaceCategories,
  getMarketplaceFilterOptions,
} from "@/lib/content/marketplace";

export default function PublicHomePage() {
  const marketplaceCategories = getMarketplaceCategories();
  const homeCategories = businessCategories
    .filter((category) => category.slug !== "delivery")
    .map((category) => {
      const match = marketplaceCategories.find((item) => item.href === category.href);

      return {
        ...category,
        metric: match?.metric,
      };
    });
  const featuredBusinesses = getFeaturedMarketplaceBusinesses(6);
  const featuredExperiences = getFeaturedExperiences(3);
  const filterOptions = getMarketplaceFilterOptions();

  return (
    <div className="space-y-10 pb-14 pt-4 md:space-y-14 md:pt-8">
      <MarketplaceHomeHero
        categories={marketplaceCategories}
        options={filterOptions}
      />

      <section className="space-y-6">
        <SectionHeader
          description="Cuatro verticales operativas para empezar a descubrir oferta local con navegación clara y filtros desde el primer día."
          eyebrow="Categorias principales"
          title="Explora el marketplace por tipo de experiencia"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {homeCategories.map((category) => (
            <CategoryCard category={category} key={category.slug} />
          ))}
        </div>
      </section>

      <MarketplaceFeaturedSection
        businesses={featuredBusinesses}
        ctaHref="/negocios"
        ctaLabel="Ver todos los negocios"
        description="Una selección inicial del marketplace para validar descubrimiento, comparación y contacto directo con comercios reales."
        eyebrow="Negocios destacados"
        title="Fichas comerciales listas para convertir"
      />

      <MarketplaceFeaturedSection
        businesses={featuredExperiences}
        ctaHref="/tours"
        ctaLabel="Ver experiencias"
        description="Operadores con salidas guiadas, contacto directo y contexto suficiente para reservar con menos fricción."
        eyebrow="Experiencias destacadas"
        title="Actividades y recorridos que venden mejor con contexto"
      />

      <section className="space-y-6">
        <SectionHeader
          description="La capa pública no solo muestra negocios: también prepara el terreno para reservas, pedidos y dashboards operativos."
          eyebrow="Marketplace listo para crecer"
          title="Una base consistente para discovery, conversión y operación"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-[28px] border-ink/10 p-6">
            <p className="text-sm font-semibold text-ink">Buscador universal</p>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              Un solo formulario reutilizable para navegar el catálogo por
              categoría, ubicación, precio y rating.
            </p>
          </Card>
          <Card className="rounded-[28px] border-ink/10 p-6">
            <p className="text-sm font-semibold text-ink">Listados por vertical</p>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              Hoteles, restaurantes, tours y transporte con rutas propias y
              filtros persistentes sobre mock data ampliado.
            </p>
          </Card>
          <Card className="rounded-[28px] border-ink/10 p-6">
            <p className="text-sm font-semibold text-ink">Detalle dinámico</p>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              Cada negocio ya tiene ficha por slug con accesos directos, datos
              operativos y negocios relacionados.
            </p>
          </Card>
        </div>
      </section>

      <MarketplaceRegisterCta />
    </div>
  );
}
