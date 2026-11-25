import type { Metadata } from "next";
import { GuiaNecocliCapurganaCronologica } from "@/components/blog/guia-necocli-capurgana-cronologica";

export const metadata: Metadata = {
    title:
        "Guía definitiva de Necoclí a Capurganá 2026: lanchas, horarios, precios y qué llevar | Portal Necoclí",
    description:
        "Viaja fácil de Necoclí a Capurganá en 2026: horarios, tarifas oficiales, equipaje permitido (10 kg), planes Día de Sol y qué empacar. Pre-reserva en línea.",
    openGraph: {
        title: "Guía definitiva de Necoclí a Capurganá 2026 | Portal Necoclí",
        description:
            "Todo el recorrido en orden cronológico: Base Náutica, horarios, tarifas 2026, planes Día de Sol y checklist interactivo de equipaje.",
        type: "article",
        locale: "es_CO",
    },
};

export default function GuiaNecocliCapurganaPage() {
    return <GuiaNecocliCapurganaCronologica />;
}