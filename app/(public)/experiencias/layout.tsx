import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiencias turísticas en Necoclí | Portal Necoclí",
  description:
    "Descubre playas, islas, gastronomía y aventuras locales. Consulta disponibilidad para planear tu experiencia en Necoclí.",
  alternates: {
    canonical: "https://portalnecocli.com/experiencias",
  },
};

export default function ExperiencesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
