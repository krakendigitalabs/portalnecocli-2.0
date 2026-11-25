import { ExperiencesSection } from "@/components/marketplace/experiences-section";
import { ExternalToursSection } from "@/components/marketplace/external-tours-section";
import { PackagesSection } from "@/components/marketplace/packages-section";
import { parseTripSearchParams, type TripSearchParams } from "@/lib/utils/trip-search-params";

export const metadata = {
  title: "Turistas - Descubre Antioquia",
  description: "Paquetes turísticos y experiencias en Antioquia.",
};

export default async function TuristasPage({
  searchParams,
}: {
  searchParams: Promise<TripSearchParams>;
}) {
  const prefill = parseTripSearchParams(await searchParams);

  return (
    <div className="flex flex-col min-h-screen bg-sand/10">
      <main className="flex-1 pb-20">
        <PackagesSection prefill={prefill} />
        <ExperiencesSection />
        <ExternalToursSection />
      </main>
    </div>
  );
}