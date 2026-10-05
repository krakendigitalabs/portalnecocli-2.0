import { PitchHero } from "@/components/b2g/pitch-hero";
import { RoyaltiesExplainer } from "@/components/b2g/royalties-explainer";
import { TechStackShowcase } from "@/components/b2g/tech-stack-showcase";
import { InvestmentRoi } from "@/components/b2g/investment-roi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propuesta de Coinversión | Portal Necoclí 2.0",
  description: "Pitch Deck Digital para la Alcaldía de Necoclí y Gremios Turísticos.",
};

export default function GobiernoPitchPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PitchHero />
      <TechStackShowcase />
      <RoyaltiesExplainer />
      <InvestmentRoi />
    </main>
  );
}
