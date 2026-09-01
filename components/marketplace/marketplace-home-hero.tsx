import { UniversalSearch } from "@/components/marketplace/universal-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MarketplaceCategory, MarketplaceFilterOptions } from "@/types/marketplace";

type MarketplaceHomeHeroProps = {
  categories: MarketplaceCategory[];
  options: MarketplaceFilterOptions;
};

export function MarketplaceHomeHero({ categories, options }: MarketplaceHomeHeroProps) {
  return (
    <section className="relative">
      <Card className="overflow-hidden rounded-[36px] border-white/50 bg-ink shadow-soft md:rounded-[42px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(221,107,66,0.28),transparent_34%)]" />
        <div className="relative grid gap-8 px-6 py-8 md:px-10 md:py-12 xl:grid-cols-[1.1fr_0.9fr] xl:gap-10 xl:px-12">
          <div className="space-y-6 text-white">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
                Marketplace publico
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                Descubre hoteles, restaurantes, tours y transporte en Necocli desde una sola
                experiencia.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                Esta fase deja operativa la base publica del portal: buscador universal, verticales
                navegables, fichas de negocio y filtros utiles para convertir mejor.
              </p>
            </div>

            <UniversalSearch
              categoryOptions={categories
                .filter((category) => category.key !== "all")
                .map((category) => ({
                  label: category.label,
                  value: category.key,
                }))}
              locationOptions={options.locations}
              placeholder="Busca por nombre, categoria, barrio o experiencia"
              priceOptions={options.priceRanges}
              ratingOptions={options.ratings}
              submitLabel="Ver resultados"
              variant="hero"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/negocios" size="lg" variant="accent">
                Explorar marketplace
              </Button>
              <Button href="/ingresar?next=/merchant" size="lg" variant="secondary">
                Registrar mi negocio
              </Button>
            </div>
          </div>

          <div className="grid gap-4 self-end sm:grid-cols-2 xl:grid-cols-1">
            {categories
              .filter((category) => category.key !== "all")
              .map((category) => (
                <Card
                  key={category.key}
                  className="rounded-[28px] border-white/12 bg-white/10 p-5 text-white backdrop-blur-sm"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">
                    {category.shortLabel}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">{category.label}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/72">{category.description}</p>
                  <div className="mt-4">
                    <Button
                      className="border-white/24 bg-white/10 text-white hover:border-white/36 hover:text-white"
                      href={category.href}
                      variant="secondary"
                    >
                      Abrir categoria
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
