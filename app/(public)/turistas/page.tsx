import { MainFooter } from "@/components/layout/main-footer";
import { MainHeader } from "@/components/layout/main-header";
import { ExperiencesSection } from "@/components/marketplace/experiences-section";
import { ExternalToursSection } from "@/components/marketplace/external-tours-section";
import { PackagesSection } from "@/components/marketplace/packages-section";
import { brand } from "@/lib/constants/site";

export const metadata = {
  title: "Turistas - Descubre Antioquia",
  description: "Paquetes turísticos y experiencias en Antioquia.",
};

export default function TuristasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-sand/10">
      <main className="flex-1 pb-20">
        <PackagesSection />
        <ExperiencesSection />
        <ExternalToursSection />
      </main>
    </div>
  );
}
