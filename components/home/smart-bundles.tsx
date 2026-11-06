import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { formatCop, SALES_WHATSAPP_PHONE, weekendPackages } from "@/data/home-offers";
import { createWhatsAppHref } from "@/lib/utils/business-links";

export function SmartBundles() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container className="max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal">
            Paquetes de fin de semana
          </p>
          <h2 className="text-3xl font-extrabold text-ink md:text-5xl">
            Escápate dos días a Necoclí
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {weekendPackages.map((pkg) => (
            <article
              className="flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-sand shadow-soft"
              key={pkg.id}
            >
              <div className="relative h-48">
                <Image
                  alt={pkg.title}
                  className="object-cover"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src={pkg.image}
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <h3 className="text-xl font-bold text-ink">{pkg.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal">
                    {pkg.highlight}
                  </p>
                  <p className="mt-2 text-sm text-ink/70">{pkg.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-ink/80">
                  {pkg.details.map((detail) => (
                    <li className="flex items-start gap-2" key={detail}>
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto border-t border-ink/10 pt-4">
                  <p className="text-xs uppercase text-ink/60">desde, por persona</p>
                  <p className="text-3xl font-extrabold text-green">{formatCop(pkg.priceCop)}</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <a
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-green px-6 py-3 text-sm font-bold text-white transition hover:bg-green/90 active:scale-95"
                      href={createWhatsAppHref(SALES_WHATSAPP_PHONE, pkg.bookingMessage)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Reservar paquete
                    </a>
                    <Link
                      className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-mist"
                      href="/turistas"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
