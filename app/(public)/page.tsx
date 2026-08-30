import { CategoryCard3D } from "@/components/marketplace/category-card-3d";
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

import { LuxuryHero } from "@/components/marketplace/luxury-hero";

import { Container } from "@/components/ui/container";

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
    <div className="pb-14">
      {/* Luxury Hero full bleed */}
      <LuxuryHero />

      {/* Massive Edge-to-Edge Grid for Categories (WebGL 3D) */}
      <section className="w-full max-w-[2400px] mx-auto px-4 md:px-8 xl:px-12 mt-20 mb-20">
        <div className="mb-10 lg:mb-16 px-2 lg:px-4 flex flex-col items-center text-center">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-ink mb-6">
            Explora el marketplace
          </h2>
          <p className="text-xl lg:text-2xl text-ink/70 max-w-3xl">
            Siente el ecosistema de Necoclí. Cada tarjeta es un portal interactivo hacia tu próxima experiencia premium.
          </p>
        </div>
        
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-4 w-full">
          {homeCategories.map((category) => (
            <CategoryCard3D category={category} key={category.slug} />
          ))}
        </div>
      </section>

      <Container className="space-y-16 md:space-y-24">
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
      </Container>
    </div>
  );
}
