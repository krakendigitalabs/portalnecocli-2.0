export const touristPackages = [
  {
    id: "alojamiento-basico",
    title: "Opción Económica y Cómoda (Pareja)",
    description:
      "Tu descanso ideal frente al mar, simple y sin complicaciones. Disfruten de una escapada en pareja práctica, cómoda y accesible en Necoclí: cercanía a la playa, parqueadero privado, WiFi para estar siempre conectados y zonas de descanso para desconectar del trabajo. ¿Prefieren relajarse al máximo? Cuentan con servicio de alimentación directo a la habitación.",
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790716725/26_habitacion_1_camas_105_yqiizb.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790402666/35_tfmand.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790716725/26_habitacion_1_camas_105_yqiizb.jpg",
    highlight: "Económico · Parqueadero privado · WiFi · Cerca a la playa",
    options: [
      {
        id: "basico_pareja",
        label: "Pareja — $70.000 total (2 personas)",
        price: 70000,
        priceUnit: "per_person" as const,
        defaultGuests: 2,
      },
      {
        id: "basico_individual",
        label: "Individual — $70.000 por persona",
        price: 70000,
        priceUnit: "per_person" as const,
        defaultGuests: 1,
      },
      {
        id: "basico_multiple",
        label: "Acomodación múltiple — $70000 por persona",
        price: 70000,
        priceUnit: "per_person" as const,
        defaultGuests: 1,
      },
    ],
  },
  {
    id: "alojamiento-piscina-comidas",
    title: "Sabor & Sol Sin Preocupaciones",
    description:
      "Día de sol con transporte, almuerzo, acceso a piscina y playa privada.",
    images: [
      "https://res.cloudinary.com/dr50ioh9h/image/upload/v1793396944/Captura_de_pantalla_2026-10-30_163742_bmlwfd.png",
      "https://res.cloudinary.com/dr50ioh9h/image/upload/v1793396920/Captura_de_pantalla_2026-10-30_163711_pabdef.png",
    ],
    image:
      "https://res.cloudinary.com/dr50ioh9h/image/upload/v1793396944/Captura_de_pantalla_2026-10-30_163742_bmlwfd.png",
    highlight: "Día de sol · Transporte · Almuerzo · Piscina · Playa privada",
    options: [
      {
        id: "sabor_sol_dia",
        label: "Día de sol — $150.000 por persona",
        price: 150000,
        priceUnit: "per_person" as const,
      },
    ],
  },
  {
    id: "sol-playa-express",
    title: "Navega Necoclí: Yate & Mar",
    description:
      "Disfruta un día de sol navegando en katamarán por 3 islas, con almuerzo y refrigerio incluidos.",
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/IMG_20240107_161824_soutyq.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003361/turismo_necocli_67_tzdjdf.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/IMG_20240107_161824_soutyq.jpg",
    highlight: "Día de sol · Katamarán 3 islas · Almuerzo y refrigerio",
    bookingUrl: "https://tours.portalnecocli.com/reservas-maritimas",
    options: [
      {
        id: "navega_necocli",
        label: "Día de sol en katamarán (3 islas) — $210.000 por persona",
        price: 210000,
        priceUnit: "per_person" as const,
      },
    ],
  },
  /* PAQUETE APAGADO TEMPORALMENTE (descomentar para volver a mostrarlo)
  {
    id: "noche-express",
    title: "Fin de Semana Completo en Pareja",
    description:
      "Dos días de experiencias inolvidables frente al mar. Vivan un sábado y domingo perfectos frente a la playa: hotel de ubicación privilegiada con atención de primera clase, piscina y servicio de alimentación incluido para que no tengan que preocuparse por nada. La combinación ideal de confort, excelente servicio y la brisa del mar para renovar energías en pareja.",
    details: [
      "Incluye un desayuno por noche, de 7:30 a. m. a 9:00 a. m.",
      "Incluye una cena frente a la playa, de 6:30 p. m. a 7:30 p. m.",
      "Precio del paquete para pareja: $400.000.",
    ],
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714012/1_veozn0.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714016/6_jlis53.jpg",
      "https://res.cloudinary.com/dr50ioh9h/image/upload/v1791576337/15_mzntsf.jpg",
    ],
    image: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714012/1_veozn0.jpg",
    highlight: "Fin de semana · Pareja · Piscina · Playa privada",
    options: [
      {
        id: "escapada_romantica_pareja",
        label: "Pareja — $200.000 por persona ($400.000 total)",
        price: 200000,
        priceUnit: "per_person" as const,
        defaultGuests: 2,
      },
    ],
  },
  */
  {
    id: "fin-de-semana",
    title: "Necoclí Imparable: Tour & Playa",
    description:
      "Combina descanso cerca al muelle con una aventura completa de navegación por tres islas en Necoclí.",
    details: [
      "Día previo: alojamiento cerca al muelle en Necoclí + 1 alimento.",
      "Domingo: día de sol con visita a tres islas, almuerzo y refrigerio.",
      "Al regreso del día de sol: 1 alimento adicional incluido.",
      "Precio: $400.000 por persona.",
    ],
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003378/turismo_necocli_69_r6u6o1.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003480/turismo_30_dzr8jh.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003509/turismo_necocli_52_paq3dl.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003378/turismo_necocli_69_r6u6o1.jpg",
    highlight: "Alojamiento cerca al muelle · 3 Islas · Alimentación incluida",
    options: [
      {
        id: "necocli_imparable",
        label: "Necoclí Imparable — $400.000 por persona",
        price: 400000,
        priceUnit: "per_person" as const,
      },
    ],
  },
  {
    id: "alojamiento-multiple",
    title: "Parche Necoclí (Grupos & Familias)",
    description:
      "Perfecto para grupos y familias. Precio especial para alojamiento en cabañas privadas con cercanía al mar.",
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1793397204/13_habitacion_2_camas_112_cxa1ej.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1793397245/triple33_wbclda.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1793397261/IMG_20250719_114130_386_mll98t.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1793397204/13_habitacion_2_camas_112_cxa1ej.jpg",
    highlight: "Grupos & Familias · Cabañas privadas · Cerca al mar",
    options: [
      {
        id: "mul_cabana",
        label: "Parche Necoclí — Cabaña privada ($80.000 por persona)",
        price: 80000,
        priceUnit: "per_person" as const,
      },
    ],
  },
];
