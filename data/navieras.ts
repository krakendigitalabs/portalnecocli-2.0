export type NavieraId = "sol-y-playa" | "el-caribe";

export interface RouteTariff {
  route: string;
  oneWay: string;
  roundTrip?: string;
  badge?: string;
}

export interface DayPassPlan {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  destinations: string[];
  includes: string[];
  schedule: string;
  note?: string;
  beachAlternative?: string;
  featured?: boolean;
}

export interface NavieraProfile {
  id: NavieraId;
  shortName: string;
  legalName: string;
  nit: string;
  tagline: string;
  badgeLabel: string;
  summary: string;
  highlights: { title: string; description: string }[];
  fleet?: {
    summary: string;
    capacities: number[];
    features: { title: string; description: string }[];
  };
  routes: RouteTariff[];
  intermediateRoutes?: RouteTariff[];
  routeScheduleNote: string;
  dayPasses: DayPassPlan[];
}

export const NAVIERAS_DATA: Record<NavieraId, NavieraProfile> = {
  "sol-y-playa": {
    id: "sol-y-playa",
    shortName: "Sol y Playa S.A.S",
    legalName: "Transporte Marítimo Sol y Playa S.A.S",
    nit: "901797992-1",
    tagline: "Tu conexión marítima desde Necoclí hacia el paraíso",
    badgeLabel: "Día de Sol · 3 Playas",
    summary:
      "Salidas desde la Base Náutica de Necoclí hacia los principales destinos del Darién con atención directa, transporte marítimo seguro y experiencia turística confiable.",
    highlights: [
      { title: "Viaje seguro", description: "Chaleco salvavidas incluido" },
      { title: "Planes turísticos", description: "Día de Sol y rutas diarias" },
      { title: "Atención directa", description: "Acompañamiento y guía local" },
      { title: "Parqueadero gratis", description: "Incluido en el plan Día de Sol" },
    ],
    routes: [
      {
        route: "Necoclí → Triganá",
        oneWay: "$75.000",
        roundTrip: "$150.000",
        badge: "Ruta diaria",
      },
      { route: "Necoclí → Acandí", oneWay: "$85.000", roundTrip: "$170.000", badge: "Ruta diaria" },
      {
        route: "Necoclí → Playa Soledad",
        oneWay: "$95.000",
        roundTrip: "$190.000",
        badge: "Ruta especial",
      },
      {
        route: "Necoclí → Bahía Aguacate",
        oneWay: "$95.000",
        roundTrip: "$190.000",
        badge: "Según clima",
      },
      {
        route: "Necoclí → Capurganá",
        oneWay: "$95.000",
        roundTrip: "$190.000",
        badge: "Ruta diaria",
      },
    ],
    routeScheduleNote:
      "Check-in: 1 hora antes. Salida desde Necoclí: 8:00 a.m. (según temporada y flujo de pasajeros se pueden habilitar horarios adicionales). Regreso Capurganá → Necoclí: 9:00 a.m.",
    dayPasses: [
      {
        id: "sol-y-playa-3-playas",
        title: "Día de Sol · 3 Playas",
        subtitle: "Visita 3 paraísos en un solo día con parqueadero gratis",
        price: "$210.000",
        destinations: ["Sapzurro", "La Miel (Panamá)", "Playa Soledad"],
        includes: [
          "Transporte marítimo ida y regreso",
          "Visita a 3 playas: Sapzurro, La Miel (Panamá) y Playa Soledad",
          "2 refrigerios incluidos",
          "Almuerzo típico",
          "Guía acompañante",
          "Póliza de seguro",
          "Servicio de parqueadero gratis",
        ],
        schedule:
          "Check-in: 6:00 a.m. · Salida: 7:00 a.m. · Regreso: 4:00 p.m. aproximadamente (sujeto a clima y restricciones de DIMAR).",
        note: "Niños a partir de los 2 años cumplidos cancelan tarifa plena. Tasas portuarias no incluidas.",
        featured: true,
      },
    ],
  },

  "el-caribe": {
    id: "el-caribe",
    shortName: "El Caribe S.A.S",
    legalName: "Comercializadora Marítima y Fluvial El Caribe S.A.S",
    nit: "901000756-8",
    tagline: "El transporte que nos une en el Caribe colombiano",
    badgeLabel: "2 Planes Día de Sol",
    summary:
      "Transporte marítimo y fluvial seguro, cómodo y confiable desde la Base Náutica de Necoclí. Contamos con una amplia flota de yates turísticos, personal calificado y operación enfocada en puntualidad y confort.",
    highlights: [
      { title: "Seguridad certificada", description: "Chalecos y pólizas vigentes" },
      { title: "Flota amplia", description: "Yates de 55 a 87 pasajeros" },
      { title: "2 Planes Día de Sol", description: "Tradicional $210k y Panamá $270k" },
      { title: "Atención confiable", description: "Reservas directas y asesoría" },
    ],
    fleet: {
      summary:
        "Yates turísticos de alta calidad revisados periódicamente para garantizar comodidad y seguridad en cada travesía.",
      capacities: [55, 60, 70, 73, 83, 87],
      features: [
        {
          title: "Chalecos salvavidas",
          description: "Certificados y exigidos por la autoridad marítima.",
        },
        {
          title: "Asientos cómodos",
          description: "Espacios diseñados para disfrutar el paisaje del golfo.",
        },
        { title: "Sonido a bordo", description: "Ambientación musical durante la travesía." },
        {
          title: "Bodegas amplias",
          description: "Compartimentos espaciosos para equipaje permitido.",
        },
        { title: "Mantenimiento constante", description: "Revisión mecánica y física periódica." },
        {
          title: "Seguros aprobados",
          description: "Pólizas vigentes avaladas por las autoridades.",
        },
      ],
    },
    routes: [
      {
        route: "Necoclí → Capurganá",
        oneWay: "$95.000",
        roundTrip: "$190.000",
        badge: "Ruta diaria",
      },
      {
        route: "Necoclí → Triganá",
        oneWay: "$75.000",
        roundTrip: "$150.000",
        badge: "Ruta diaria",
      },
      { route: "Necoclí → Acandí", oneWay: "$85.000", roundTrip: "$170.000", badge: "Ruta diaria" },
    ],
    intermediateRoutes: [
      { route: "Capurganá → Necoclí", oneWay: "$95.000" },
      { route: "Acandí → Necoclí", oneWay: "$85.000" },
      { route: "Triganá → Necoclí", oneWay: "$75.000" },
      { route: "Capurganá ↔ Triganá", oneWay: "$75.000" },
      { route: "Capurganá ↔ Acandí", oneWay: "$55.000" },
      { route: "Triganá ↔ Acandí", oneWay: "$55.000" },
    ],
    routeScheduleNote:
      "Salidas diarias desde Necoclí a las 8:00 a.m. Regresos con hora por confirmar según operación, clima, ocupación y condiciones marítimas.",
    dayPasses: [
      {
        id: "el-caribe-soledad-sapzurro",
        title: "Día de Sol · Playa Soledad y Sapzurro",
        subtitle: "Recorrido por dos destinos naturales del Caribe colombiano",
        price: "$210.000",
        destinations: ["Playa Soledad", "Sapzurro"],
        includes: [
          "Transporte marítimo ida y vuelta",
          "Refrigerio incluido",
          "Almuerzo incluido",
          "Guía turístico acompañante",
          "Póliza de viaje",
          "Día de naturaleza y playa",
        ],
        schedule:
          "Salidas diarias a las 8:00 a.m. Hora de regreso confirmada según operación, clima y condiciones marítimas.",
        note: "Niños desde los 2 años cumplidos cancelan tarifa plena. Tasas portuarias no incluidas.",
      },
      {
        id: "el-caribe-panama",
        title: "Plan Día de Sol en Panamá",
        subtitle: "Salida desde Necoclí hacia La Miel y Puerto Obaldía",
        price: "$270.000",
        destinations: ["La Miel (Panamá)", "Puerto Obaldía (Panamá)", "Playa La Boquita"],
        includes: [
          "Visita a La Miel y Puerto Obaldía, Panamá",
          "Refrigerio en la mañana",
          "Almuerzo incluido",
          "US$3 consumibles en Puerto Obaldía para el refrigerio de la tarde",
          "Póliza de viaje",
          "Un tour guiado a elegir entre Playa Los Lagartos, El Faro o La Represa",
        ],
        schedule:
          "Salida desde Necoclí (Base Náutica). Presentar documento de identidad original o pasaporte vigente.",
        beachAlternative:
          "¿Prefieres quedarte disfrutando de la playa? Si no deseas desplazarte a los sitios del recorrido, puedes quedarte disfrutando de la Playa La Boquita.",
        note: "Niños desde los 2 años cumplidos cancelan tarifa plena. Tasas portuarias no incluidas.",
        featured: true,
      },
    ],
  },
};
