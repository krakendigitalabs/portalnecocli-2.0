import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CommercialHomeContent } from "@/types/commercial-content";

type HomeHeroProps = {
  content: CommercialHomeContent["hero"];
};

export function HomeHero({ content }: HomeHeroProps) {
  const spotlightSlides = content.slides.slice(0, 3);
  const previewSlides = content.slides.slice(3, 6);

  return (
    <section className="relative">
      <Card className="relative isolate overflow-hidden rounded-[40px] border-white/50 bg-ink shadow-soft">
        <div className="absolute inset-0">
          {spotlightSlides.map((slide, index) => (
            <div
              key={slide.image}
              className="hero-slide"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(9, 19, 24, 0.18) 0%, rgba(9, 19, 24, 0.72) 72%, rgba(9, 19, 24, 0.92) 100%), url('${slide.image}')`,
                animationDelay: `${index * 6}s`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(221,107,66,0.28),transparent_34%)]" />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/24 to-transparent" />
        </div>

        <div className="relative min-h-[calc(100vh-8.5rem)] px-6 py-8 md:px-10 md:py-10 xl:px-12 xl:py-12">
          <div className="flex min-h-[inherit] flex-col justify-between gap-12">
            <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
              <div className="max-w-3xl space-y-6 text-white">
                <Badge className="bg-white/14 text-white" variant="neutral">
                  {content.eyebrow}
                </Badge>
                <div className="space-y-4">
                  <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl xl:text-7xl">
                    {content.title}
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                    {content.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button href={content.primaryCta.href} size="lg" variant="accent">
                    {content.primaryCta.label}
                  </Button>
                  <Button
                    className="border-white/24 bg-white/10 text-white hover:border-white/36 hover:text-white"
                    href={content.secondaryCta.href}
                    size="lg"
                    variant="secondary"
                  >
                    {content.secondaryCta.label}
                  </Button>
                </div>
                <div className="grid gap-3 pt-2 sm:grid-cols-3">
                  {content.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[26px] border border-white/14 bg-white/10 px-5 py-5 backdrop-blur-sm"
                    >
                      <p className="text-3xl font-semibold tracking-tight text-white">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/72">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 xl:pl-10">
                <div className="rounded-[30px] border border-white/14 bg-black/22 p-6 text-white backdrop-blur-md">
                  <p className="text-sm uppercase tracking-[0.26em] text-white/60">
                    Portada inmersiva
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    Necoclí se vende mejor cuando combina emoción visual, accesos rápidos y fichas listas para reservar.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    Esta capa prioriza descubrimiento, intención comercial y conexión inmediata con negocios, reservas y aliados.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                  {previewSlides.map((slide) => (
                    <div
                      key={slide.image}
                      className="group relative overflow-hidden rounded-[28px] border border-white/14 bg-white/8 p-5 text-white backdrop-blur-sm"
                    >
                      <div
                        className="absolute inset-0 scale-105 bg-cover bg-center transition duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(9, 19, 24, 0.12), rgba(9, 19, 24, 0.84)), url('${slide.image}')`,
                        }}
                      />
                      <div className="relative space-y-3">
                        <Badge className="bg-white/12 text-white" variant="neutral">
                          {slide.label}
                        </Badge>
                        <p className="text-lg font-semibold tracking-tight">
                          {slide.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {content.slides.map((slide) => (
                <div
                  key={slide.title}
                  className="rounded-[28px] border border-white/12 bg-white/8 p-4 text-white backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/58">
                    {slide.label}
                  </p>
                  <p className="mt-3 text-base font-semibold leading-6">
                    {slide.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
