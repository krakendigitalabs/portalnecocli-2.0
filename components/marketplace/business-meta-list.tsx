import type { FeaturedBusiness } from "@/types/featured-business";

type BusinessMetaListProps = {
  business: FeaturedBusiness;
};

export function BusinessMetaList({ business }: BusinessMetaListProps) {
  const locationLabel = [business.address, business.neighborhood, business.city]
    .filter(Boolean)
    .join(", ");
  const hoursLabel = business.businessHours
    ?.map((entry) =>
      entry.closed
        ? `${entry.day}: Cerrado`
        : `${entry.day}: ${entry.open} - ${entry.close}`,
    )
    .join(" | ");

  const items = [
    { label: "Ubicación", value: locationLabel },
    { label: "Teléfono", value: business.phone, href: `tel:${business.phone.replace(/\D/g, "")}` },
    {
      label: "WhatsApp",
      value: business.whatsapp,
      href: `https://wa.me/${business.whatsapp.replace(/\D/g, "")}`,
    },
    business.email
      ? { label: "Correo", value: business.email, href: `mailto:${business.email}` }
      : null,
    business.website
      ? { label: "Sitio web", value: business.website, href: business.website }
      : null,
    business.rating ? { label: "Calificación", value: `${business.rating}/5` } : null,
    business.priceRange
      ? { label: "Rango de precio", value: business.priceRange }
      : null,
    hoursLabel ? { label: "Horario", value: hoursLabel } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href?: string }>;

  return (
    <dl className="grid gap-3" aria-label={`Informacion de ${business.name}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-ink/10 bg-white/86 px-4 py-3"
        >
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coral">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm leading-6 text-ink/74">
            {item.href ? (
              <a
                className="transition hover:text-teal"
                href={item.href}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
