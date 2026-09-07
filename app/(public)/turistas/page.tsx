import { ExternalToursSection } from "@/components/marketplace/external-tours-section";
import { MainHeader } from "@/components/layout/main-header";
import { MainFooter } from "@/components/layout/main-footer";
import { brand } from "@/lib/constants/site";

export const metadata = {
  title: "Turistas - Descubre Antioquia",
  description: "Paquetes turísticos y experiencias en Antioquia.",
};

export default function TuristasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-sand/10">
      <main className="flex-1">
        <ExternalToursSection />
      </main>
    </div>
  );
}
