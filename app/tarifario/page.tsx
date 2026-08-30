import type { Metadata } from "next";
import { TariffCalculatorPage } from "./tariff-calculator-page";

export const metadata: Metadata = {
  title: "Tarifario de Servicios | Portal Necoclí",
  description:
    "Cotiza tu estadía en Necoclí con nuestro tarifario dinámico. Hospedaje, alimentación, transporte y experiencias turísticas. Calcula el total y reserva en segundos.",
};

export default function TarifarioPage() {
  return <TariffCalculatorPage />;
}
