import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CommercialHomeContent } from "@/types/commercial-content";

type HomeHeroProps = {
  content: CommercialHomeContent["hero"];
};

export function HomeHero({ content }: HomeHeroProps) {
  return (
    <Card className="overflow-hidden rounded-[36px] border-ink/10">
      <div className="grid gap-8 bg-hero-glow px-6 py-8 md:px-10 md:py-12 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Badge variant="teal">{content.eyebrow}</Badge>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              {content.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-ink/72 md:text-lg">
              {content.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={content.primaryCta.href} size="lg" variant="primary">
              {content.primaryCta.label}
            </Button>
            <Button
              href={content.secondaryCta.href}
              size="lg"
              variant="secondary"
            >
              {content.secondaryCta.label}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 self-end">
          <div className="rounded-[30px] bg-ink px-6 py-7 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-white/60">
              Conversión más clara
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              Turismo, comercio local y soporte directo en una sola experiencia.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/74">
              La portada ahora prioriza descubrimiento, intención comercial y
              contacto inmediato.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {content.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-ink/10 bg-white/92 px-5 py-5"
              >
                <p className="text-2xl font-semibold text-ink">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-ink/68">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
