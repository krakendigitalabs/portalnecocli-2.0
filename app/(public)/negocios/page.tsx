import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { MarketplaceListingPage } from "@/components/marketplace/marketplace-listing-page";
import { getMarketplaceListingData } from "@/lib/content/marketplace";
import type { MarketplaceSearchParams } from "@/types/marketplace";

type Props = {
  searchParams: Promise<MarketplaceSearchParams>;
};

// --- METADATA DINÁMICA & SEO ---
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category ? resolvedParams.category : "Empresas Recomendadas";
  
  const title = `${category} en Necoclí | Portal Necoclí 2.0`;
  const description = `Explora la mejor selección de ${category.toLowerCase()} en Necoclí. Encuentra servicios locales verificados, alojamiento, gastronomía y contacto directo.`;

  return {
    title,
    description,
    alternates: { canonical: "https://portalnecocli.com/negocios" },
    openGraph: {
      title,
      description,
      url: "https://portalnecocli.com/negocios",
      siteName: "Portal Necoclí",
      locale: "es_CO",
      type: "website",
      images: [{
        url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739291734/turismo_necocli_111_hwcnic.jpg",
        width: 1200,
        height: 630,
        alt: `Explora ${category} en Necoclí`,
      }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// --- COMPONENTE PRINCIPAL ---
export default async function BusinessesDirectoryPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  let data;
  
  try {
    data = await getMarketplaceListingData(resolvedParams);
  } catch (error) {
    console.error("[BusinessesDirectoryPage] Error:", error);
    data = { businesses: [], categories: [], total: 0, filters: resolvedParams || {} };
  }

  const hasNoBusinesses = !data || data.total === 0 || data.businesses?.length === 0;

  if (hasNoBusinesses) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block p-4 rounded-full bg-slate-100 mb-4 text-2xl">🔍</div>
        <h2 className="text-3xl font-bold text-ink mb-2">No encontramos resultados</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          No hay negocios registrados que coincidan con la categoría o filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<DirectorySkeleton />}>
      <MarketplaceListingPage data={data} />
    </Suspense>
  );
}

// --- SKELETON DE CARGA ---
function DirectorySkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-2xl w-1/3 mb-4 mx-auto" />
      <div className="h-5 bg-slate-200 rounded-xl w-1/2 mb-12 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 bg-slate-100 rounded-[32px]" />
        ))}
      </div>
    </div>
  );
}