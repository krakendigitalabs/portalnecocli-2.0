import type { Metadata } from "next";
import { MarketplaceListingPage } from "@/components/marketplace/marketplace-listing-page";
import { getMarketplaceListingData } from "@/lib/content/marketplace";
import type { MarketplaceSearchParams } from "@/types/marketplace";

export const metadata: Metadata = {
  title: "Transporte en Necocli | Portal Necocli 2.0",
  description:
    "Compara traslados y transporte turistico por cobertura, zona, precio y calificacion en el marketplace de Necocli.",
};

type TransportPageProps = {
  searchParams?: Promise<MarketplaceSearchParams>;
};

export default async function TransportPage({ searchParams }: TransportPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = getMarketplaceListingData(resolvedSearchParams, {
    serviceType: "transporte",
  });

  return <MarketplaceListingPage data={data} />;
}
