import type { FeaturedBusiness } from "@/types/featured-business";

type BusinessMetaListProps = {
  business: FeaturedBusiness;
};

export function BusinessMetaList({ business }: BusinessMetaListProps) {
  // Generar un texto de beneficios dinámico basado en la categoría
  const getBenefits = () => {
    switch (business.serviceType) {
      case "hotel":
        return "Descanso asegurado, atención prioritaria y ubicación estratégica para tu estadía en el golfo.";
      case "turismo":
        return "Conexión directa con la naturaleza, guías expertos locales y rutas seguras.";
      case "restaurante":
        return "Ingredientes frescos de la región, ambiente acogedor y servicio de alta calidad.";
      case "transporte":
        return "Movilidad garantizada, puntualidad y vehículos preparados para el terreno local.";
      default:
        return "Atención premium, validado por la plataforma y listo para ofrecer la mejor experiencia en Necoclí.";
    }
  };

  const amenities =
    business.tags?.length > 0 ? business.tags.join(" • ") : "Múltiples comodidades disponibles.";

  const hoursLabel =
    business.businessHours
      ?.map((entry) =>
        entry.closed ? `${entry.day}: Cerrado` : `${entry.day}: ${entry.open} - ${entry.close}`,
      )
      .join(" | ") || "Sujeto a disponibilidad y reserva previa.";

  const items = [
    {
      label: "Comodidades del sitio",
      value: amenities,
    },
    {
      label: "Experiencia y Beneficios",
      value: getBenefits(),
    },
    business.rating
      ? {
          label: "Reputación y Calidad",
          value: `${business.rating}/5 - Calificación basada en experiencia de usuarios.`,
        }
      : null,
    {
      label: "Disponibilidad Operativa",
      value: hoursLabel,
    },
  ].filter(Boolean) as Array<{ label: string; value: string; href?: string }>;

  return (
    <dl className="grid gap-4 mt-6" aria-label={`Informacion de ${business.name}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="group relative overflow-hidden rounded-[24px] border border-ink/5 bg-gradient-to-br from-white to-sand/20 p-5 transition-all hover:border-gold/30 hover:shadow-md"
        >
          <div className="absolute top-0 right-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-gold/5 blur-2xl group-hover:bg-gold/10 transition-colors" />
          <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/40 mb-3 group-hover:text-gold transition-colors">
            {item.label}
          </dt>
          <dd className="relative z-10 text-[15px] font-medium leading-relaxed text-ink/80">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
