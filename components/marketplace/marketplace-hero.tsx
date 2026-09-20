import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";

export function MarketplaceHero() {
  return (
    <Card className="overflow-hidden rounded-[32px]">
      <div className="grid gap-10 bg-hero-glow px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-12">
        <div className="space-y-6">
          <Badge variant="teal">Portal premium para Necoclí</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              Descubre una experiencia moderna para hospitalidad, turismo y comercio local.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-ink/72 md:text-lg">
              Portal Necoclí 2.0 inicia con una base visual sólida para crecer por fases, con diseño
              limpio, navegación clara y componentes reutilizables listos para producción.
            </p>
          </div>
          <SearchBar />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/#directory" size="lg" variant="secondary">
              Explorar directorio
            </Button>
          </div>
        </div>
        <div className="grid gap-4 self-end">
          <div className="rounded-[28px] bg-ink p-6 text-white">
            <p className="text-sm text-white/70">Estado del proyecto</p>
            <p className="mt-3 text-3xl font-semibold">Fase 2 en base visual</p>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Sistema visual, layout premium y componentes reutilizables para la portada pública.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[24px] border border-ink/10 bg-sand p-5">
              <p className="text-sm text-ink/70">Verticales</p>
              <p className="mt-2 text-2xl font-semibold text-ink">5</p>
            </div>
            <div className="rounded-[24px] border border-ink/10 bg-white p-5">
              <p className="text-sm text-ink/70">Enfoque</p>
              <p className="mt-2 text-2xl font-semibold text-ink">Premium</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
