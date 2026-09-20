import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FeaturedBusiness } from "@/types/featured-business";

const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ThumbsUp = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const MapPin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

interface BookingBusinessCardProps {
  business: FeaturedBusiness;
}

export function BookingBusinessCard({ business }: BookingBusinessCardProps) {
  // Generar la URL de la ficha
  const href = `/negocios/${business.slug}`;

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border-ink/10 bg-white transition hover:border-teal/30 hover:shadow-md sm:flex-row">
      {/* Imagen izquierda (o superior en mobile) */}
      <div className="relative aspect-[4/3] w-full shrink-0 sm:w-[280px] sm:max-w-[280px]">
        <Link href={href} className="block h-full w-full">
          <Image
            src={business.image}
            alt={business.name}
            fill
            className="object-contain p-4 bg-white transition duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, 280px"
          />
        </Link>
        {/* Favorito (corazón) flotante */}
        <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink/40 shadow-sm transition hover:text-coral">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Contenido principal (centro y derecha) */}
      <div className="flex flex-1 flex-col p-4 sm:flex-row sm:p-5">
        {/* Columna Centro: Información */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-teal sm:text-xl">
              <Link href={href} className="hover:underline">
                {business.name}
              </Link>
            </h3>
            {/* Estrellas mockeadas (3 estrellas como ejemplo base) */}
            <div className="flex text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
            </div>
            {/* Badge de pulgar arriba */}
            <div className="ml-1 flex h-5 w-5 items-center justify-center rounded bg-yellow-400 text-white">
              <ThumbsUp className="h-3 w-3" />
            </div>
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-ink/70">
            <Link
              href={business.mapLink || "#"}
              target="_blank"
              className="flex items-center gap-1 font-medium text-teal hover:underline"
            >
              <MapPin className="h-4 w-4" />
              {business.neighborhood || business.city}
            </Link>
            <button className="font-semibold text-teal hover:underline">Mostrar en el mapa</button>
            <span className="hidden text-ink/50 sm:inline">•</span>
            <span className="hidden sm:inline">a 350 m del centro</span>
          </div>

          {/* Badge Genius si aplica */}
          {business.isGenius && (
            <div className="mt-2 inline-block rounded bg-[#003580] px-2 py-0.5 text-xs font-bold text-white">
              Genius
            </div>
          )}

          {/* Tags */}
          <div className="mt-3 hidden sm:block">
            <div className="mb-1 text-sm font-bold text-ink">
              {business.propertyType || "Alojamiento"}
            </div>
            {business.tags.map((tag) => (
              <p key={tag} className="text-sm text-ink/70">
                • {tag}
              </p>
            ))}
          </div>

          {/* Etiqueta de cancelación verde estilo Booking */}
          <div className="mt-2 text-xs font-bold text-green-600 sm:mt-3">
            <p>Cancelación GRATIS</p>
            <p className="font-normal">No pagas nada hasta el momento de reservar</p>
          </div>
        </div>

        {/* Columna Derecha: Precio y Call to Action */}
        <div className="mt-4 flex flex-col justify-between sm:mt-0 sm:ml-6 sm:w-[200px] sm:items-end sm:text-right">
          {/* Reviews Score */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
            <div className="flex flex-col sm:items-end">
              <span className="font-bold text-ink">{business.ratingLabel || "Excelente"}</span>
              <span className="text-xs text-ink/60">{business.reviewCount || 120} comentarios</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-t-md rounded-br-md rounded-bl-sm bg-[#003b95] text-sm font-bold text-white">
              {business.rating || "8.5"}
            </div>
          </div>

          {/* Precio y botón */}
          <div className="mt-4 flex flex-row items-end justify-between sm:mt-0 sm:flex-col">
            <div className="text-left sm:text-right">
              <p className="text-xs text-ink/60">Precio por noche desde</p>
              <p className="text-xl font-bold text-ink">
                {business.numericPrice
                  ? new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(business.numericPrice)
                  : "$ 120.000"}
              </p>
              <p className="text-xs text-ink/50">+ impuestos y cargos</p>
            </div>

            <div className="mt-3">
              <Button
                href={href}
                variant="primary"
                className="w-full bg-[#0071c2] hover:bg-[#005999]"
              >
                Ver disponibilidad {">"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
