import { Check } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import {
  formatCop,
  getBundleRegularTotal,
  getBundleSavings,
  SALES_WHATSAPP_PHONE,
  smartBundles,
} from "@/data/home-offers";
import { createWhatsAppHref } from "@/lib/utils/business-links";

export function SmartBundles() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container className="max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal">
            Paquetes todo incluido
          </p>
          <h2 className="text-3xl font-extrabold text-ink md:text-5xl">
            Combina y ahorra en tu viaje
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {smartBundles.map((bundle) => {
            const savings = getBundleSavings(bundle);

            return (
              <article
                className="flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-sand shadow-soft"
                key={bundle.id}
              >
                <div className="relative h-40">
                  <Image
                    alt={bundle.title}
                    className="object-cover"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    src={bundle.image}
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink shadow">
                    Ahorras {formatCop(savings)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="text-xl font-bold text-ink">{bundle.title}</h3>
                  <ul className="space-y-2 text-sm text-ink/80">
                    {bundle.items.map((item) => (
                      <li className="flex items-center justify-between gap-3" key={item.label}>
                        <span className="flex items-center gap-2">
                          <Check aria-hidden className="h-4 w-4 text-green" />
                          {item.label}
                        </span>
                        <span className="text-ink/50 line-through">{formatCop(item.priceCop)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto border-t border-ink/10 pt-4">
                    <p className="text-xs text-ink/60">
                      Valor por separado: {formatCop(getBundleRegularTotal(bundle))}
                    </p>
                    <p className="text-3xl font-extrabold text-green">
                      {formatCop(bundle.bundlePriceCop)}
                    </p>
                    <a
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-green px-6 py-3 text-sm font-bold text-white transition hover:bg-green/90 active:scale-95"
                      href={createWhatsAppHref(SALES_WHATSAPP_PHONE, bundle.bookingMessage)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Reservar paquete
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
