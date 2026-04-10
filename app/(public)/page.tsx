import { MarketplaceHero } from "@/components/marketplace/marketplace-hero";
import { MarketplaceCategories } from "@/components/marketplace/marketplace-categories";
import { BusinessShowcase } from "@/components/marketplace/business-showcase";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { businessCategories } from "@/data/categories";
import { featuredBusinesses } from "@/data/businesses";

const highlightItems = [
  {
    title: "Diseño premium",
    description:
      "Una base visual limpia y comercial para reforzar confianza desde la primera visita.",
  },
  {
    title: "Componentes reutilizables",
    description:
      "Bloques consistentes para acelerar crecimiento sin duplicar UI ni estilos.",
  },
  {
    title: "Mobile-first",
    description:
      "Jerarquía clara, cards legibles y navegación adaptable para usuarios en movimiento.",
  },
];

export default function PublicHomePage() {
  return (
    <div className="space-y-10 pb-14 pt-6 md:space-y-14 md:pt-10">
      <MarketplaceHero />
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Base visual"
          title="Una portada pensada para conversión, claridad y crecimiento"
          description="La experiencia inicial combina una dirección turística moderna con piezas reutilizables que servirán para las siguientes fases del marketplace."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {highlightItems.map((item) => (
            <Card
              key={item.title}
              className="rounded-[28px] border-ink/10 p-6"
            >
              <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/70">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
      <MarketplaceCategories categories={businessCategories} />
      <BusinessShowcase businesses={featuredBusinesses} />
    </div>
  );
}
