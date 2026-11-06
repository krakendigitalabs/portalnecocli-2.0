import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { featuredPackages, formatCop, SALES_WHATSAPP_PHONE } from "@/data/home-offers";
import { createWhatsAppHref } from "@/lib/utils/business-links";

export function FeaturedExperiences() {
  return (
    <section className="bg-sand py-16 md:py-20">
      <Container className="max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal">Imperdibles</p>
          <h2 className="text-3xl font-extrabold text-ink md:text-5xl">Días de sol en Necoclí</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredPackages.map((offer) => (
            <article
              className="group overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow hover:shadow-2xl"
              key={offer.id}
            >
              <div className="relative h-56 sm:h-64">
                <Image
                  alt={offer.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src={offer.image}
                />
                {offer.popular ? (
                  <span className="absolute left-4 top-4 rounded-full bg-coral px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                    🔥 Más Popular
                  </span>
                ) : null}
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <h3 className="text-2xl font-bold text-ink">{offer.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal">
                    {offer.highlight}
                  </p>
                  <p className="mt-2 text-sm text-ink/70">{offer.description}</p>
                </div>
                <p className="text-ink">
                  <span className="text-xs uppercase text-ink/60">desde </span>
                  <span className="text-3xl font-extrabold">{formatCop(offer.priceCop)}</span>
                  <span className="text-xs text-ink/60"> por persona</span>
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-bold text-white shadow-lg shadow-coral/30 transition hover:bg-coral/90 active:scale-95"
                    href={createWhatsAppHref(SALES_WHATSAPP_PHONE, offer.bookingMessage)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Reservar en 1-Clic
                  </a>
                  <Link
                    className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-mist"
                    href="/turistas"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
