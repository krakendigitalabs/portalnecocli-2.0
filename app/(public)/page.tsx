import type { Metadata } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "Portal Necoclí | Turismo, Hoteles, Tours y Experiencias en el Mar Dulce",
  description:
    "Descubre lo mejor de Necoclí: reserva hoteles, pasajes marítimos a Capurganá y Triganá, días de sol, gastronomía local y experiencias inolvidables.",
  alternates: {
    canonical: "https://portalnecocli.com",
  },
  openGraph: {
    title: "Portal Necoclí | Turismo, Hoteles y Experiencias",
    description:
      "Planea tu visita a Necoclí: descubre experiencias, alojamiento, gastronomía y servicios locales.",
    url: "https://portalnecocli.com",
    siteName: "Portal Necoclí",
    locale: "es_CO",
    type: "website",
  },
};

export default function PublicHomePage() {
  return <HomeClient />;
}
