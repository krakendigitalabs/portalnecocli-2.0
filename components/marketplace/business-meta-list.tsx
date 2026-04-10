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
    { label: "Ubicacion", value: locationLabel },
    { label: "Telefono", value: business.phone },
    { label: "WhatsApp", value: business.whatsapp },
    business.email ? { label: "Correo", value: business.email } : null,
    business.website ? { label: "Sitio web", value: business.website } : null,
    business.rating ? { label: "Calificacion", value: `${business.rating}/5` } : null,
    business.priceRange
      ? { label: "Rango de precio", value: business.priceRange }
      : null,
    hoursLabel ? { label: "Horario", value: hoursLabel } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <dl className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-ink/10 bg-white/86 px-4 py-3"
        >
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coral">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm leading-6 text-ink/74">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
