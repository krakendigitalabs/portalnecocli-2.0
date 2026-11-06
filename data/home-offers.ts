export const SALES_WHATSAPP_PHONE = "573217511866";

export type HomeOffer = Readonly<{
  id: string;
  title: string;
  description: string;
  image: string;
  priceCop: number;
  priceLabel?: string;
  popular: boolean;
  detailsHref: string;
  bookingMessage: string;
}>;

export type HomeBundleItem = Readonly<{ label: string; priceCop: number }>;

export type HomeBundle = Readonly<{
  id: string;
  title: string;
  image: string;
  items: readonly HomeBundleItem[];
  bundlePriceCop: number;
  bookingMessage: string;
}>;

export const featuredOffers: readonly HomeOffer[] = [
  {
    id: "island-tour",
    title: "Tour a Islas del Golfo",
    description: "Lancha, playas de arena blanca y almuerzo costeño con guía local.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739291734/turismo_necocli_111_hwcnic.jpg",
    priceCop: 50000,
    priceLabel: "desde",
    popular: true,
    detailsHref: "/tours",
    bookingMessage:
      "¡Hola Alejandro! Quiero reservar el Tour a Islas desde $50.000 COP. ¿Qué fechas hay disponibles?",
  },
  {
    id: "atv-tour",
    title: "Aventura en Cuatrimoto",
    description: "Ruta por playa y senderos costeros con equipo de seguridad incluido.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003485/turismo_necocli_35_c81lmu.jpg",
    priceCop: 120000,
    priceLabel: "desde",
    popular: true,
    detailsHref: "/tours/cuatrimoto",
    bookingMessage:
      "¡Hola Alejandro! Quiero reservar el Tour en Cuatrimoto. ¿Qué horarios tienen disponibles?",
  },
];

export const smartBundles: readonly HomeBundle[] = [
  {
    id: "bundle-caribe-total",
    title: "Caribe Total · 2 días / 1 noche",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739291734/turismo_necocli_111_hwcnic.jpg",
    items: [
      { label: "Hospedaje Donde Yuvis (1 noche)", priceCop: 120000 },
      { label: "Lancha ida y vuelta", priceCop: 60000 },
      { label: "Tour en Cuatrimoto", priceCop: 120000 },
    ],
    bundlePriceCop: 255000,
    bookingMessage:
      "¡Hola Alejandro! Quiero el paquete Caribe Total (Hospedaje Donde Yuvis + Lancha + Cuatrimoto). ¿Me ayudas a reservar?",
  },
  {
    id: "bundle-islas-express",
    title: "Islas Express · Día completo",
    image: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1754277470/plato_4_akdkbk.jpg",
    items: [
      { label: "Tour a Islas", priceCop: 50000 },
      { label: "Almuerzo típico", priceCop: 35000 },
      { label: "Lancha ida y vuelta", priceCop: 60000 },
    ],
    bundlePriceCop: 125000,
    bookingMessage:
      "¡Hola Alejandro! Quiero el paquete Islas Express (Tour + Almuerzo + Lancha). ¿Hay cupo?",
  },
];

export function getBundleSavings(bundle: HomeBundle): number {
  const total = bundle.items.reduce((sum, item) => sum + item.priceCop, 0);
  return Math.max(0, total - bundle.bundlePriceCop);
}

export function getBundleRegularTotal(bundle: HomeBundle): number {
  return bundle.items.reduce((sum, item) => sum + item.priceCop, 0);
}

export function formatCop(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
