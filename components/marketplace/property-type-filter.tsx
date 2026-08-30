import Link from "next/link";
import { PropertyType } from "@/types/featured-business";

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: "Hoteles", value: "Hotel" },
  { label: "Apartamentos", value: "Apartamento" },
  { label: "Resorts", value: "Resort" },
  { label: "Villas", value: "Villa" },
  { label: "Hostales", value: "Hostal" },
  { label: "Casa Hoteles", value: "Casa Hotel" },
];

interface PropertyTypeFilterProps {
  baseHref: string;
  currentType?: string;
}

export function PropertyTypeFilter({ baseHref, currentType }: PropertyTypeFilterProps) {
  return (
    <div className="mb-6 flex flex-col space-y-3">
      <h3 className="text-lg font-bold text-ink">Buscar por tipo de alojamiento</h3>
      <div className="flex w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-3">
          <Link
            href={baseHref}
            className={`inline-flex whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
              !currentType
                ? "border-teal bg-teal text-white"
                : "border-ink/10 bg-white text-ink hover:border-teal/30 hover:text-teal"
            }`}
          >
            Todos
          </Link>
          {PROPERTY_TYPES.map((type) => {
            const isActive = currentType === type.value;
            // Construimos la URL agregando o reemplazando el propertyType
            // Nota: en un caso real se usaría useSearchParams para mantener otros filtros.
            // Por simplicidad, agregaremos el query param ?propertyType=...
            const href = `${baseHref}?propertyType=${encodeURIComponent(type.value)}`;

            return (
              <Link
                key={type.value}
                href={href}
                className={`inline-flex whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-teal bg-teal text-white"
                    : "border-ink/10 bg-white text-ink hover:border-teal/30 hover:text-teal"
                }`}
              >
                {type.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
