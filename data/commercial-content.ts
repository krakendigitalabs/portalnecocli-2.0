import type { CommercialHomeContent } from "@/types/commercial-content";

const whatsappTouristHref =
  "https://wa.me/573217511866?text=%C2%A1Hola!%20Quiero%20reservar%20mi%20experiencia%20en%20Necocl%C3%AD.";
const whatsappMerchantHref =
  "https://wa.me/573217511866?text=Hola,%20estoy%20interesado%20en%20vincular%20mi%20comercio%20a%20Portal%20Necocl%C3%AD.";

export const commercialHomeContent: CommercialHomeContent = {
  hero: {
    eyebrow: "Portal oficial de turismo y comercio local",
    title: "Todo lo esencial para vivir Necoclí en un solo portal.",
    description:
      "Encuentra alojamiento, gastronomía, planes turísticos, transporte y atención local con una experiencia más clara, confiable y lista para convertir visitas en reservas.",
    primaryCta: {
      label: "Reservar por WhatsApp",
      href: whatsappTouristHref,
      external: true,
    },
    secondaryCta: {
      label: "Explorar directorio",
      href: "/negocios",
    },
    stats: [
      { value: "5", label: "verticales comerciales prioritarias" },
      { value: "1", label: "punto de contacto para reservas y soporte" },
      { value: "2026", label: "nueva etapa digital del portal" },
    ],
  },
  valueProposition: {
    eyebrow: "Propuesta de valor",
    title: "Una operación más simple para turistas y una vitrina más útil para los comercios.",
    description:
      "La nueva home concentra lo que más importa: orientación rápida para visitantes, visibilidad práctica para afiliados y canales directos de conversión.",
    points: [
      {
        title: "Información útil desde el primer vistazo",
        description:
          "El visitante entiende qué puede encontrar, cómo reservar y dónde pedir ayuda sin navegar menús confusos.",
      },
      {
        title: "Comercios mejor presentados",
        description:
          "Cada negocio puede mostrarse con una propuesta más clara, categorías consistentes y llamadas a la acción visibles.",
      },
      {
        title: "Atención directa por WhatsApp",
        description:
          "El canal comercial principal queda integrado como CTA de reserva, soporte y afiliación.",
      },
    ],
  },
  touristSection: {
    id: "tourists",
    eyebrow: "Para turistas y visitantes",
    title: "Llega con contexto, elige mejor y reserva con acompañamiento.",
    description:
      "Migramos el recorrido comercial central del portal actual para que la visita tenga una lógica clara: descubrir, comparar, reservar y recibir soporte durante la experiencia.",
    steps: [
      {
        title: "Descubre",
        description:
          "Explora hoteles, restaurantes, rutas y experiencias locales desde una portada más ordenada y orientada a decisión.",
        cta: {
          label: "Ver directorio",
          href: "/negocios",
        },
      },
      {
        title: "Elige",
        description:
          "Encuentra opciones para viajes familiares, escapadas rápidas o planes guiados según el tipo de experiencia que buscas.",
      },
      {
        title: "Reserva",
        description:
          "Activa la conversación por WhatsApp para resolver disponibilidad, precios y recomendaciones antes de confirmar.",
        cta: {
          label: "Reservar ahora",
          href: whatsappTouristHref,
          external: true,
        },
      },
      {
        title: "Disfruta con soporte",
        description:
          "El portal mantiene un canal de ayuda activo para orientar puntos de encuentro, dudas frecuentes y contacto local.",
      },
    ],
  },
  merchantSection: {
    id: "businesses",
    eyebrow: "Para comercios afiliados",
    title: "Más visibilidad, mejor presentación y un canal comercial siempre activo.",
    description:
      "La propuesta para afiliados se reorganiza alrededor de resultados reales: aparecer mejor, explicar mejor la oferta y facilitar el contacto con turistas y comunidad local.",
    steps: [
      {
        title: "Vincúlate",
        description:
          "Conecta tu negocio con la red de Portal Necoclí para entrar al ecosistema comercial y turístico del destino.",
        cta: {
          label: "Afiliar mi comercio",
          href: whatsappMerchantHref,
          external: true,
        },
      },
      {
        title: "Gana visibilidad",
        description:
          "Tu marca aparece dentro del directorio recomendado con estructura clara para servicios, ubicación y categoría.",
      },
      {
        title: "Promociona mejor",
        description:
          "La nueva presentación facilita mostrar bonos, experiencias, temporada alta, atención directa y diferenciadores.",
      },
      {
        title: "Recibe soporte comercial",
        description:
          "Si no puedes responder de inmediato, Portal Necoclí mantiene un canal de orientación inicial para interesados.",
        cta: {
          label: "Solicitar asesoría",
          href: whatsappMerchantHref,
          external: true,
        },
      },
    ],
  },
  directorySection: {
    eyebrow: "Directorio recomendado",
    title: "Una muestra inicial del tipo de oferta que el portal puede escalar.",
    description:
      "Estos registros funcionan como contenido semilla para la nueva home comercial: categorías claras, descripción breve y CTA directo para consulta o reserva.",
    listings: [
      {
        id: "hotel-brisa-marina",
        name: "Hotel Brisa Marina",
        category: "Hotelería",
        summary:
          "Hospedaje frente al mar con ambiente familiar, reservas flexibles y apoyo para planes en playa.",
        location: "Malecón de Necoclí",
        priceLabel: "Desde $$$",
        tags: ["Reserva directa", "Frente al mar"],
        cta: {
          label: "Consultar disponibilidad",
          href: whatsappTouristHref,
          external: true,
        },
      },
      {
        id: "cabanas-arena-clara",
        name: "Cabañas Arena Clara",
        category: "Hotelería",
        summary:
          "Opción boutique para descanso, escapadas de fin de semana y viajeros que buscan privacidad.",
        location: "Zona playa",
        priceLabel: "Desde $$$",
        tags: ["Escapadas", "Ambiente boutique"],
        cta: {
          label: "Hablar con asesor",
          href: whatsappTouristHref,
          external: true,
        },
      },
      {
        id: "mar-de-sabores",
        name: "Mar de Sabores",
        category: "Gastronomía",
        summary:
          "Cocina costera con platos locales, atención para grupos y posibilidad de domicilios en zona urbana.",
        location: "Centro urbano",
        priceLabel: "Ticket promedio $$",
        tags: ["Cocina local", "Domicilios"],
        cta: {
          label: "Pedir información",
          href: whatsappTouristHref,
          external: true,
        },
      },
      {
        id: "ruta-manglar-experience",
        name: "Ruta Manglar Experience",
        category: "Turismo",
        summary:
          "Experiencias guiadas para quienes buscan naturaleza, recorridos tranquilos y lectura local del territorio.",
        location: "Salida desde zona turística",
        priceLabel: "Plan guiado $$",
        tags: ["Tours guiados", "Naturaleza"],
        cta: {
          label: "Explorar plan",
          href: whatsappTouristHref,
          external: true,
        },
      },
      {
        id: "golfo-transfer",
        name: "Golfo Transfer",
        category: "Transporte turístico",
        summary:
          "Traslados coordinados para viajeros, familias y grupos pequeños con atención previa por chat.",
        location: "Cobertura local y conexiones",
        priceLabel: "Servicio por trayecto",
        tags: ["Traslados", "Coordinación previa"],
        cta: {
          label: "Solicitar traslado",
          href: whatsappTouristHref,
          external: true,
        },
      },
      {
        id: "necocli-express",
        name: "Necoclí Express",
        category: "Domicilios",
        summary:
          "Apoyo para entregas urbanas y pedidos rápidos conectados con comercios aliados del portal.",
        location: "Cobertura céntrica",
        priceLabel: "Entrega local",
        tags: ["Entrega rápida", "Comercio local"],
        cta: {
          label: "Hablar por WhatsApp",
          href: whatsappTouristHref,
          external: true,
        },
      },
    ],
  },
  reservationCta: {
    eyebrow: "Reserva y atención inmediata",
    title: "Cuando la decisión está tomada, el siguiente paso debe ser inmediato.",
    description:
      "La home nueva cierra con un bloque de conversión simple: escribir por WhatsApp para reservar, pedir orientación o iniciar la afiliación comercial.",
    primaryCta: {
      label: "Reservar experiencia",
      href: whatsappTouristHref,
      external: true,
    },
    secondaryCta: {
      label: "Ubicación y contacto",
      href: "#contact",
    },
  },
  contactSection: {
    eyebrow: "Contacto y redes",
    title: "Un canal visible para atención, reservas y presencia de marca.",
    description:
      "Consolidamos los datos visibles del portal actual para que la nueva versión tenga una base comercial consistente desde el inicio.",
    contactItems: [
      {
        label: "Dirección",
        value: "CR49 54-03, Barrio Simón Bolívar, Necoclí - Antioquia",
        href: "https://www.google.com/maps?q=8.4252,-76.7841",
      },
      {
        label: "WhatsApp",
        value: "321 751 1866",
        href: "https://wa.me/573217511866",
      },
      {
        label: "Correo principal",
        value: "guia@portalnecocli.com",
        href: "mailto:guia@portalnecocli.com",
      },
      {
        label: "Correo alterno",
        value: "portalnecocli@gmail.com",
        href: "mailto:portalnecocli@gmail.com",
      },
      {
        label: "Horario",
        value: "Lun-Vie 9am - 8pm | Sáb-Dom 9am - 4pm",
      },
    ],
    socialLinks: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/people/Portal-Necocli/100084510412418/",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/portalnecocli/?hl=es",
      },
      {
        label: "X",
        href: "https://x.com/Portalnecocli",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@portalnecocli",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/channel/UCrgjIBaQVDFms2WU77ye9tA",
      },
    ],
  },
};
