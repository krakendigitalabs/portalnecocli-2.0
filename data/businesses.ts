import type { Business } from "@/types/business";

export const featuredBusinesses: Business[] = [
  {
    id: "hotel-brisa-marina",
    name: "Hotel Brisa Marina",
    slug: "hotel-brisa-marina",
    category: "hotels",
    categoryLabel: "Hotelería",
    summary:
      "Hotel frente al mar con enfoque boutique, estancias familiares y reservas flexibles.",
    location: "Malecón de Necoclí",
    priceRange: "$$$",
    status: "active",
  },
  {
    id: "sabor-de-origen",
    name: "Sabor de Origen",
    slug: "sabor-de-origen",
    category: "restaurants",
    categoryLabel: "Alimentos",
    summary:
      "Restaurante de cocina costera con operación preparada para mesa y domicilios.",
    location: "Centro urbano",
    priceRange: "$$",
    status: "active",
  },
  {
    id: "ruta-manglar",
    name: "Ruta Manglar",
    slug: "ruta-manglar",
    category: "tours",
    categoryLabel: "Turismo",
    summary:
      "Operador de recorridos ecológicos y experiencias guiadas para grupos pequeños.",
    location: "Zona turística",
    priceRange: "$$",
    status: "draft",
  },
];
