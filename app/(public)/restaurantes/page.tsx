import type { Metadata } from "next";
import { MarketplaceListingPage } from "@/components/marketplace/marketplace-listing-page";
import { getMarketplaceListingData } from "@/lib/content/marketplace";
import type { MarketplaceSearchParams } from "@/types/marketplace";

export const metadata: Metadata = {
  title: "Restaurantes en Necocli | Portal Necocli 2.0",
  description:
    "Descubre restaurantes y cocina local con filtros por zona, precio y calificación en Portal Necoclí.",
};

type RestaurantsPageProps = {
  searchParams?: Promise<MarketplaceSearchParams>;
};

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = getMarketplaceListingData(resolvedSearchParams, {
    serviceType: "restaurante",
  });

  return <MarketplaceListingPage data={data} />;
}
