import type { Metadata } from "next";
import { MarketplaceListingPage } from "@/components/marketplace/marketplace-listing-page";
import { getMarketplaceListingData } from "@/lib/content/marketplace";
import type { MarketplaceSearchParams } from "@/types/marketplace";

export const metadata: Metadata = {
  title: "Marketplace de Necocli | Portal Necocli 2.0",
  description:
    "Explora hoteles, restaurantes, tours y transporte con filtros base y fichas de negocio listas para descubrir y contactar.",
  alternates: {
    canonical: "https://portalnecocli.com/negocios",
  },
};

type BusinessesDirectoryPageProps = {
  searchParams?: Promise<MarketplaceSearchParams>;
};

export default async function BusinessesDirectoryPage({
  searchParams,
}: BusinessesDirectoryPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = getMarketplaceListingData(resolvedSearchParams);

  return <MarketplaceListingPage data={data} />;
}
