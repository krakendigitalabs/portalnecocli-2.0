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
  const mobileSlides = content.slides.slice(0, 3);

  return (
    <section className="relative">
      <Card className="relative isolate overflow-hidden rounded-[30px] border-white/50 bg-ink shadow-soft md:rounded-[40px]">
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

        <div className="relative min-h-[calc(100vh-9.5rem)] px-4 py-5 sm:px-6 sm:py-6 md:min-h-[calc(100vh-8.5rem)] md:px-10 md:py-10 xl:px-12 xl:py-12">
          <div className="flex min-h-[inherit] flex-col justify-between gap-12">
            <div className="grid gap-6 md:gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
              <div className="max-w-3xl space-y-5 text-white md:space-y-6">
                <Badge className="bg-white/14 text-white" variant="neutral">
                  {content.eyebrow}
                </Badge>
                <div className="space-y-3 md:space-y-4">
                  <h1 className="max-w-4xl text-[2.35rem] font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl md:text-6xl xl:text-7xl">
                    {content.title}
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-white/78 sm:text-base md:text-lg">
                    {content.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    className="w-full sm:w-auto"
                    href={content.primaryCta.href}
                    size="lg"
                    variant="accent"
                  >
                    {content.primaryCta.label}
                  </Button>
                  <Button
                    className="w-full border-white/24 bg-white/10 text-white hover:border-white/36 hover:text-white sm:w-auto"
                    href={content.secondaryCta.href}
                    size="lg"
                    variant="secondary"
                  >
                    {content.secondaryCta.label}
                  </Button>
                </div>
                <div className="grid gap-3 pt-1 sm:grid-cols-3 md:pt-2">
                  {content.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[22px] border border-white/14 bg-white/10 px-4 py-4 backdrop-blur-sm md:rounded-[26px] md:px-5 md:py-5"
                    >
                      <p className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-white/72 md:text-sm md:leading-6">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 md:hidden">
                  {mobileSlides.map((slide) => (
                    <div
                      key={slide.title}
                      className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-4 text-white backdrop-blur-sm"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">
                        {slide.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6">{slide.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden gap-4 md:grid xl:pl-10">
                <div className="rounded-[30px] border border-white/14 bg-black/22 p-6 text-white backdrop-blur-md">
                  <p className="text-sm uppercase tracking-[0.26em] text-white/60">
                    Portada inmersiva
                  </p>
                  <p className="mt-4 text-2xl font-semibold tracking-tight xl:text-3xl">
                    Necoclí se vende mejor cuando combina emoción visual, accesos rápidos y fichas
                    listas para reservar.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    Esta capa prioriza descubrimiento, intención comercial y conexión inmediata con
                    negocios, reservas y aliados.
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
                        <p className="text-lg font-semibold tracking-tight">{slide.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden gap-4 md:grid lg:grid-cols-3">
              {content.slides.map((slide) => (
                <div
                  key={slide.title}
                  className="rounded-[28px] border border-white/12 bg-white/8 p-4 text-white backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/58">
                    {slide.label}
                  </p>
                  <p className="mt-3 text-base font-semibold leading-6">{slide.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
