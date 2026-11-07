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
        id: "basico_individual",
        label: "Individual — $40.000 por persona",
        price: 40000,
        priceUnit: "per_person" as const,
        defaultGuests: 1,
      },
      {
        id: "basico_pareja",
        label: "Pareja — $75.000 total (2 personas)",
        price: 37500,
        priceUnit: "per_person" as const,
        defaultGuests: 2,
      },
      {
        id: "basico_multiple",
        label: "Acomodación múltiple — $35.000 por persona",
        price: 35000,
        priceUnit: "per_person" as const,
        defaultGuests: 1,
      },
    ],
  },
  {
    id: "alojamiento-piscina-comidas",
    title: "Sabor & Sol Sin Preocupaciones",
    description: "Día de sol con almuerzo, acceso a piscina y playa privada.",
    images: [
      "https://res.cloudinary.com/dr50ioh9h/image/upload/v1793396944/Captura_de_pantalla_2026-10-30_163742_bmlwfd.png",
      "https://res.cloudinary.com/dr50ioh9h/image/upload/v1793396920/Captura_de_pantalla_2026-10-30_163711_pabdef.png",
    ],
    image: "https://res.cloudinary.com/dr50ioh9h/image/upload/v1793396944/Captura_de_pantalla_2026-10-30_163742_bmlwfd.png",
    highlight: "Día de sol · Almuerzo · Piscina · Playa privada",
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
    description: "Disfruta un día de sol navegando en yate, con almuerzo y refrigerio incluidos.",
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/IMG_20240107_161824_soutyq.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003361/turismo_necocli_67_tzdjdf.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/IMG_20240107_161824_soutyq.jpg",
    highlight: "Día de sol · Yate · Almuerzo y refrigerio",
    bookingUrl: "https://tours.portalnecocli.com/reservas-maritimas",
    options: [
      {
        id: "navega_necocli",
        label: "Día de sol en yate — $210.000 por persona",
        price: 210000,
        priceUnit: "per_person" as const,
      },
    ],
  },
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
  {
    id: "fin-de-semana",
    title: "Necoclí Imparable: Tour & Playa",
    description:
      "Dos días de naturaleza y mar para descubrir algunos de los paisajes más especiales de Necoclí.",
    details: [
      "Sábado: recorrido por la vereda Peniel, el Árbol Mágico, la Ciénaga del Salado y el río.",
      "Domingo: día de sol con visita a tres islas, almuerzo y refrigerio.",
      "Precio: $790.000 por persona.",
    ],
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003378/turismo_necocli_69_r6u6o1.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003480/turismo_30_dzr8jh.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003509/turismo_necocli_52_paq3dl.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003378/turismo_necocli_69_r6u6o1.jpg",
    highlight: "2 días · Árbol Mágico · Ciénaga · Tres islas",
    options: [
      {
        id: "necocli_imparable",
        label: "Necoclí Imparable — $790.000 por persona",
        price: 790000,
        priceUnit: "per_person" as const,
      },
    ],
  },
  {
    id: "alojamiento-multiple",
    title: "Parche Necoclí (Grupos & Familias)",
    description:
      "Perfecto para grupos, familias o mochileros. Precio especial por noche en alojamiento compartido, con la opción de añadir las comidas que necesites a lo largo del día.",
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1793397204/13_habitacion_2_camas_112_cxa1ej.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1793397245/triple33_wbclda.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1793397261/IMG_20250719_114130_386_mll98t.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1793397204/13_habitacion_2_camas_112_cxa1ej.jpg",
    highlight: "Grupal · Precio especial · Comidas opcionales",
    options: [
      {
        id: "mul_solo",
        label: "Parche Necoclí — Solo alojamiento múltiple (1 noche)",
        price: 50000,
      },
      {
        id: "mul_1c",
        label: "Parche Necoclí — Alojamiento múltiple + 1 comida",
        price: 67000,
      },
      {
        id: "mul_2c",
        label: "Parche Necoclí — Alojamiento múltiple + 2 comidas",
        price: 84000,
      },
      {
        id: "mul_3c",
        label: "Parche Necoclí — Alojamiento múltiple + 3 comidas",
        price: 101000,
      },
    ],
  },
];
