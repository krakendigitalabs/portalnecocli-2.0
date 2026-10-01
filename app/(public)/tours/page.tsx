import type { Metadata } from "next";
import { MarketplaceListingPage } from "@/components/marketplace/marketplace-listing-page";
import { getMarketplaceListingData } from "@/lib/content/marketplace";
import type { MarketplaceSearchParams } from "@/types/marketplace";

export const metadata: Metadata = {
  title: "Tours en Necocli | Portal Necocli 2.0",
  description:
    "Explora tours, experiencias guiadas y actividades con filtros por punto de encuentro, precio y rating.",
};

type ToursPageProps = {
  searchParams?: Promise<MarketplaceSearchParams>;
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = await getMarketplaceListingData(resolvedSearchParams, {
    serviceType: "turismo",
  });

  return <MarketplaceListingPage data={data} />;
}
