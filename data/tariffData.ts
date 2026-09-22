/**
 * Tarifario oficial de Portal Necoclí.
 * Todos los precios en COP (pesos colombianos).
 */

export interface TariffService {
  id: string;
  name: string;
  description: string;
  icon: string;
  unit: string; // "noche" | "persona" | "hora" | "carrera" | "día"
  priceMin?: number;
  priceMax?: number; // Si hay rango
  priceFixed?: number; // Si el precio es fijo (sin rango)
  priceOptions?: { label: string; value: number }[]; // Para selección múltiple
  note?: string; // Aclaraciones adicionales
}

export interface TariffCategory {
  id: string;
  name: string;
  icon: string;
  services: TariffService[];
}

export const TARIFF_CATEGORIES: TariffCategory[] = [
  {
    id: "hospedaje",
    name: "Hospedaje",
    icon: "🏨",
    services: [
      {
        id: "habitacion",
        name: "Habitación por noche",
        description: "Alojamiento en hoteles, cabañas y hostales de Necoclí",
        icon: "🛏️",
        unit: "noche",
        priceMin: 60_000,
        priceMax: 3_500_000,
        note: "El precio depende del tipo de habitación y temporada. Selecciona el rango con el deslizador.",
      },
    ],
  },
  {
    id: "alimentacion",
    name: "Alimentación",
    icon: "🍽️",
    services: [
      {
        id: "desayuno_basico",
        name: "Desayuno Básico",
        description: "Café, pan, huevo y fruta",
        icon: "☕",
        unit: "persona",
        priceFixed: 11_000,
      },
      {
        id: "desayuno_premium",
        name: "Desayuno Premium",
        description: "Buffet completo con jugos naturales",
        icon: "🍳",
        unit: "persona",
        priceFixed: 22_000,
      },
      {
        id: "almuerzo",
        name: "Almuerzo",
        description: "Platos típicos de la región hasta mariscos premium",
        icon: "🐟",
        unit: "persona",
        priceMin: 22_000,
        priceMax: 145_000,
      },
      {
        id: "cena",
        name: "Cena",
        description: "Desde menú del día hasta experiencias gastronómicas exclusivas",
        icon: "🌙",
        unit: "persona",
        priceMin: 22_000,
        priceMax: 180_000,
      },
    ],
  },
  {
    id: "transporte",
    name: "Transporte",
    icon: "🛵",
    services: [
      {
        id: "transporte_hora",
        name: "Transporte Local (por hora)",
        description: "Mototaxi o vehículo disponible por horas dentro de la zona",
        icon: "🛵",
        unit: "hora",
        priceFixed: 30_000,
      },
      {
        id: "carrera_urbana",
        name: "Carrera Casco Urbano",
        description: "Trayecto dentro del área urbana de Necoclí",
        icon: "🗺️",
        unit: "carrera",
        priceFixed: 8_000,
      },
      {
        id: "carrera_alrededores",
        name: "Alrededores del Casco Urbano",
        description: "Zonas aledañas al casco urbano",
        icon: "🛣️",
        unit: "carrera",
        priceFixed: 12_000,
      },
      {
        id: "carrera_veredas",
        name: "Traslado a Veredas",
        description: "Destinos rurales y veredas. Precio a convenir según destino.",
        icon: "🌿",
        unit: "carrera",
        priceFixed: 0,
        note: "Precio a convenir con el operador según la distancia y destino.",
      },
    ],
  },
  {
    id: "experiencias",
    name: "Experiencias & Guía",
    icon: "🧭",
    services: [
      {
        id: "guia_local",
        name: "Guía Local",
        description: "Guía turístico certificado con conocimiento de la región",
        icon: "🧭",
        unit: "hora",
        priceFixed: 150_000,
      },
      {
        id: "dia_sol_local",
        name: "Día de Sol Local",
        description: "Jornada de playa en Necoclí con servicios incluidos",
        icon: "☀️",
        unit: "persona",
        priceFixed: 120_000,
        note: "Sujeto a disponibilidad.",
      },
      {
        id: "dia_islas",
        name: "Día de Islas",
        description: "Excursión a las Islas de Necoclí (ida y vuelta en lancha)",
        icon: "🏝️",
        unit: "persona",
        priceFixed: 250_000,
        note: "Sujeto a disponibilidad y condiciones del mar.",
      },
    ],
  },
  {
    id: "eventos",
    name: "Eventos & Celebraciones",
    icon: "🎉",
    services: [
      {
        id: "lugar_eventos",
        name: "Lugar para Eventos",
        description:
          "Salones y espacios para bodas, quinceañeros, grados, corporativos y celebraciones especiales en Necoclí",
        icon: "🏛️",
        unit: "evento",
        priceMin: 1_500_000,
        priceMax: 3_500_000,
        note: "Incluye montaje básico. Decoración, catering y personal adicional se cotizan por separado.",
      },
    ],
  },
];

/** Establecimientos locales recomendados */
export const LOCAL_SHOPS = [
  {
    name: "Supermercado Maracaná",
    type: "Supermercado",
    icon: "🛒",
    description: "Abastecimiento general para tu estadía",
  },
  {
    name: "Droguería Farma Vida",
    type: "Droguería",
    icon: "💊",
    description: "Medicamentos y productos de cuidado personal",
  },
];

/** Comisión del Portal Necoclí sobre el total pagado */
export const PORTAL_COMMISSION_RATE = 0.1; // 10%
