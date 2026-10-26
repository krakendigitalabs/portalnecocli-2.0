import type { AtvRouteDetail } from "@/types/atv-booking";

export const ATV_ROUTES: AtvRouteDetail[] = [
  {
    id: "ruta1",
    number: 1,
    title: "Árbol Mágico & Ciénaga del Salado",
    description:
      "Pasamos por vereda Peniel, conoceremos el Árbol Mágico, la Ciénaga del Salado y bordeamos el río en una experiencia mágica llena de naturaleza.",
    duration: "2 Horas",
    priceForTwo: 230000,
    includesLunch: false,
    isExtremeRoute: false,
  },
  {
    id: "ruta2",
    number: 2,
    title: "Veredas, Pantano & Finca de Frutales",
    description:
      "Pasamos por veredas del municipio de Necoclí, tendremos pantano, bosque y llegamos a deleitar la vista de una finca de la región de frutales.",
    duration: "3 Horas",
    priceForTwo: 300000,
    includesLunch: false,
    isExtremeRoute: false,
  },
  {
    id: "ruta3",
    number: 3,
    title: "Pantano, Playa & Mar con Almuerzo",
    description:
      "Pasamos por veredas del municipio de Necoclí, paisajes, bosque, terminamos en playa y mar. Esta ruta incluye almuerzo típico de la región.",
    duration: "5 Horas",
    priceForTwo: 400000,
    includesLunch: true,
    isExtremeRoute: false,
  },
  {
    id: "ruta4",
    number: 4,
    title: "Aventura Extrema: Pantano Extremo",
    description:
      "Esta ruta es para personas con experiencia en conducción de cuatrimotos. Tenemos pantano extremo y paisajes espectaculares. ¡No te pierdas esta aventura!",
    duration: "A convenir",
    priceForTwo: 0,
    includesLunch: false,
    isExtremeRoute: true,
  },
];
