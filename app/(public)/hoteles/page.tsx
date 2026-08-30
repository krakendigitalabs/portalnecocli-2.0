import type { Metadata } from "next";
import { MarketplaceListingPage } from "@/components/marketplace/marketplace-listing-page";
import { getMarketplaceListingData } from "@/lib/content/marketplace";
import type { MarketplaceSearchParams } from "@/types/marketplace";

export const metadata: Metadata = {
  title: "Hoteles en Necocli | Portal Necocli 2.0",
  description:
    "Explora hoteles, cabanas y alojamientos con filtros por zona, precio y rating dentro del marketplace de Necocli.",
};

type HotelsPageProps = {
  searchParams?: Promise<MarketplaceSearchParams>;
};

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = getMarketplaceListingData(resolvedSearchParams, {
    serviceType: "hotel",
  });

  return <MarketplaceListingPage data={data} />;
}
