import type { CommercialHomeContent } from "@/types/commercial-content";

const whatsappTouristHref =
  "https://wa.me/573217511866?text=%C2%A1Hola!%20Quiero%20reservar%20mi%20experiencia%20en%20Necocl%C3%AD.";
const whatsappMerchantHref =
  "https://wa.me/573217511866?text=Hola,%20estoy%20interesado%20en%20vincular%20mi%20comercio%20a%20Portal%20Necocl%C3%AD.";
const directoryHref = "/negocios";
const tourismMapHref = "https://www.google.com/maps?q=Necocli,+Antioquia";

export const commercialHomeContent: CommercialHomeContent = {
  hero: {
    eyebrow: "Portal oficial de turismo y comercio local",
    title:
      "Hospedaje, turismo y negocios listos para convertir tu visita en una experiencia mejor organizada.",
    description:
      "Descubre planes frente al mar, gastronomía local, experiencias guiadas y comercios aliados con una portada inmersiva, accesos rápidos y un directorio pensado para reservar, llamar y llegar sin fricción.",
    primaryCta: {
      label: "Reservar por WhatsApp",
      href: whatsappTouristHref,
      external: true,
    },
    secondaryCta: {
      label: "Explorar directorio",
      href: directoryHref,
    },
    stats: [
      { value: "5+", label: "categorías para hospedaje, tours y comercio local" },
      { value: "1", label: "canal directo para reservas y orientación" },
      { value: "24/7", label: "descubrimiento digital siempre disponible" },
    ],
    slides: [
      {
        image:
          "https://res.cloudinary.com/dr50ioh9h/image/upload/v1752722255/familia_22_febopw.png",
        alt: "Familia disfrutando una experiencia turística en Necoclí",
        title: "Viajes familiares con soporte real",
        label: "Hospitalidad y confianza",
      },
      {
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1737932109/Playa_necocli_6_usilb7.jpg",
        alt: "Playa de Necoclí al atardecer",
        title: "Playa, descanso y estadías frente al mar",
        label: "Hotelería y escapadas",
      },
      {
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003509/turismo_necocli_52_paq3dl.jpg",
        alt: "Turistas recorriendo Necoclí",
        title: "Rutas y experiencias guiadas",
        label: "Turismo local",
      },
      {
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1754277470/plato_4_akdkbk.jpg",
        alt: "Plato gastronómico destacado en Necoclí",
        title: "Gastronomía costera para descubrir y pedir",
        label: "Sabores del destino",
      },
      {
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1739291954/turismo_necocli_motonecos_1_mmblod.jpg",
        alt: "Transporte turístico en Necoclí",
        title: "Movilidad y conexión con operadores locales",
        label: "Traslados y apoyo local",
      },
      {
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1737932069/MAravillaas_vimond.jpg",
        alt: "Paisaje turístico en Necoclí",
        title: "Un destino que mezcla playa, naturaleza y comercio vivo",
        label: "Necoclí premium",
      },
    ],
  },
  showcaseSection: {
    eyebrow: "Escápate mejor",
    title: "Una portada visual para turismo, hotelería y experiencias con intención de reserva.",
    description:
      "Distribuimos escenas reales del destino para que la home comunique descanso, gastronomía y aventura antes de que el usuario entre al directorio.",
    items: [
      {
        id: "showcase-hotels",
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003434/turismo_necocli_57_gqvstk.jpg",
        alt: "Vista de turismo y descanso en Necoclí",
        eyebrow: "Hoteles y estadías",
        title: "Encuentra alojamientos para familias, escapadas y grupos.",
        description:
          "Desde opciones frente al mar hasta hospedajes prácticos para viajes rápidos, la experiencia arranca con una selección más fácil de explorar.",
        href: directoryHref,
        label: "Ver hospedajes y negocios",
      },
      {
        id: "showcase-food",
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1754277470/plato_4_akdkbk.jpg",
        alt: "Gastronomía local de Necoclí",
        eyebrow: "Gastronomía local",
        title: "Platos, sabores y pedidos con CTAs visibles.",
        description:
          "La nueva estructura destaca negocios para comer en sitio, reservar una mesa o escribir por WhatsApp sin perder tiempo.",
        href: whatsappTouristHref,
        label: "Reservar o pedir por WhatsApp",
      },
      {
        id: "showcase-tours",
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003414/turismo_necocli_60_cu438c.jpg",
        alt: "Experiencia turística en Necoclí",
        eyebrow: "Tours y experiencias",
        title: "Explora rutas, planes guiados y movilidad para recorrer Necoclí.",
        description:
          "Pensado para convertir interés en acción: ver detalles, pedir orientación y confirmar el plan desde un canal comercial directo.",
        href: tourismMapHref,
        label: "Cómo llegar y planear la ruta",
      },
      {
        id: "showcase-discovery",
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003480/turismo_30_dzr8jh.jpg",
        alt: "Paisaje y exploración en Necoclí",
        eyebrow: "Explora mejor",
        title: "Usa la home como puerta de entrada para decidir rápido y seguir al directorio.",
        description:
          "Las imágenes grandes, el copy más comercial y la navegación reforzada ayudan a mover al usuario desde inspiración hacia conversión.",
        href: directoryHref,
        label: "Entrar al directorio premium",
      },
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
          href: directoryHref,
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
  bonusSection: {
    eyebrow: "Bonos, salud y aliados",
    title: "Espacios promocionales para impulsar campañas, aliados y beneficios locales.",
    description:
      "La home queda preparada para exhibir bonos, activaciones comerciales y marcas aliadas con imagen, contexto y salida directa a contacto o detalle.",
    items: [
      {
        id: "bonus-antorchas",
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1743533135/Antorchas_aou9lw.png",
        alt: "Promoción comercial de Antorchas",
        eyebrow: "Sección de bonos",
        title: "Bonos y campañas de temporada con visibilidad premium.",
        description:
          "Un formato pensado para exhibir promociones especiales, temporadas altas y llamados de acción rápidos desde la portada.",
        href: directoryHref,
        label: "Explorar negocios afiliados",
      },
      {
        id: "bonus-farmavida",
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1743533128/Farma_Vida_Drogueria_Necocli_nbz8wy.png",
        alt: "Imagen promocional de Farma Vida Droguería Necoclí",
        eyebrow: "Aliados permanentes",
        title: "Marcas sin fecha de caducidad para servicios de confianza.",
        description:
          "Esta franja permite resaltar aliados estratégicos con presencia estable dentro del ecosistema comercial del portal.",
        href: whatsappMerchantHref,
        label: "Solicitar presencia de marca",
      },
      {
        id: "bonus-aly-dental",
        image:
          "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1743275339/aly_dental_sjxhou.png",
        alt: "Imagen promocional de Aly Dental",
        eyebrow: "Salud y servicios",
        title: "Servicios complementarios que elevan la utilidad del portal.",
        description:
          "No todo es turismo: también hay espacio para negocios de salud, bienestar y atención local con un tratamiento visual más sólido.",
        href: directoryHref,
        label: "Ver oportunidades de visibilidad",
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
