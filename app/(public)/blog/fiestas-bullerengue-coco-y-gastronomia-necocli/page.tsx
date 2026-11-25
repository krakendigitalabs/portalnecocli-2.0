import type { Metadata } from "next";
import { CalendarioCulturalGastronomicoNecocli } from "@/components/blog/calendario-cultural-gastronomico-necocli";

export const metadata: Metadata = {
    title:
        "Del Bullerengue a las Fiestas del Coco: calendario cultural y gastronómico de Necoclí | Portal Necoclí",
    description:
        "Descubre cuándo viajar a Necoclí: Fiestas del Coco en enero, Festival de Verano en agosto, Bullerengue en octubre y la mejor ruta gastronómica de mariscos y arroz con coco.",
    openGraph: {
        title:
            "Del Bullerengue a las Fiestas del Coco: calendario cultural y gastronómico de Necoclí",
        description:
            "Calendario de fiestas en Necoclí, orgullo futbolero de Juan Guillermo Cuadrado y ruta interactiva de platos típicos y artesanías en coco.",
        type: "article",
        locale: "es_CO",
    },
};

export default function FiestasBullerengueGastronomiaPage() {
    return <CalendarioCulturalGastronomicoNecocli />;
}