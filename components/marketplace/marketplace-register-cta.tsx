import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MarketplaceRegisterCta() {
  return (
    <section>
      <Card className="rounded-[34px] border-ink/10 bg-hero-glow px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
              Crece con el portal
            </p>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Registra tu negocio y preparate para reservas, pedidos y operacion comercial desde una sola plataforma.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-ink/72">
              Esta base publica ya deja visible el valor del portal: discovery,
              contacto directo y una estructura lista para crecer hacia flujos
              transaccionales por comercio.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button href="/ingresar?next=/merchant" size="lg">
              Registrar negocio
            </Button>
            <Button href="/negocios" size="lg" variant="secondary">
              Ver marketplace
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
