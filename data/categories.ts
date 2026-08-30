import type { Category } from "@/types/category";

export const businessCategories: Category[] = [
  {
    slug: "hotels",
    label: "Hotelería",
    shortLabel: "Stay",
    description:
      "Hospedajes, alojamientos boutique y experiencias de descanso con enfoque premium.",
    href: "/hoteles",
  },
  {
    slug: "tours",
    label: "Turismo",
    shortLabel: "Tours",
    description:
      "Experiencias guiadas, planes locales y actividades para descubrir Necoclí.",
    href: "/tours",
  },
  {
    slug: "restaurants",
    label: "Restaurantes",
    shortLabel: "Food",
    description:
      "Restaurantes, cocina local, cartas digitales y operaciones de consumo.",
    href: "/restaurantes",
  },
  {
    slug: "transport",
    label: "Transporte turístico",
    shortLabel: "Move",
    description:
      "Rutas, traslados y movilidad organizada para turistas y operadores.",
    href: "/transporte",
  },
  {
    slug: "delivery",
    label: "Domicilios",
    shortLabel: "Fast",
    description:
      "Servicios de entrega con claridad operativa y cobertura local preparada.",
    href: "/negocios?category=domicilios",
  },
];
