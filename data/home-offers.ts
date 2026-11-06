import { touristPackages } from "@/data/tourist-packages";

export const SALES_WHATSAPP_PHONE = "573217511866";

export type HomePackage = Readonly<{
  id: string;
  title: string;
  description: string;
  highlight: string;
  details: readonly string[];
  image: string;
  priceCop: number;
  popular: boolean;
  bookingMessage: string;
}>;

function toHomePackage(id: string, popular: boolean): HomePackage {
  const pkg = touristPackages.find((item) => item.id === id);

  if (!pkg) {
    throw new Error(`Tourist package not found: ${id}`);
  }

  const priceCop = Math.min(...pkg.options.map((option) => option.price));
  const details = "details" in pkg && pkg.details ? pkg.details : [];

  return {
    id: pkg.id,
    title: pkg.title,
    description: pkg.description,
    highlight: pkg.highlight,
    details,
    image: pkg.image,
    priceCop,
    popular,
    bookingMessage: `¡Hola Alejandro! Quiero reservar "${pkg.title}". ¿Qué fechas hay disponibles?`,
  };
}

export const featuredPackages: readonly HomePackage[] = [
  toHomePackage("alojamiento-piscina-comidas", true),
  toHomePackage("sol-playa-express", false),
];

export const weekendPackages: readonly HomePackage[] = [
  toHomePackage("noche-express", false),
  toHomePackage("fin-de-semana", false),
];

export function formatCop(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
