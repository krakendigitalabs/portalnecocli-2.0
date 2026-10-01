import Link from "next/link";
import { BookingBusinessCard } from "@/components/marketplace/booking-business-card";
import { PropertyTypeFilter } from "@/components/marketplace/property-type-filter";
import { UniversalSearch } from "@/components/marketplace/universal-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMarketplaceCategories, getMarketplaceSearchSummary } from "@/lib/content/marketplace";
import type { MarketplaceListingData } from "@/types/marketplace";

type MarketplaceListingPageProps = {
  data: MarketplaceListingData;
};

export async function MarketplaceListingPage({ data }: MarketplaceListingPageProps) {
  const categoryLinks = await getMarketplaceCategories();
  const summary = getMarketplaceSearchSummary(data.filters);
  const categoryOptions = categoryLinks
    .filter((category) => category.key !== "all")
    .map((category) => ({
      label: category.label,
      value: category.key,
    }));

  return (
    <div className="space-y-8 pb-14 pt-6 md:space-y-10 md:pt-10">
      <Card className="overflow-hidden rounded-[36px] border-ink/10">
        <div className="grid gap-6 bg-hero-glow px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
              {data.category.shortLabel}
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              {data.category.heroTitle}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-ink/72">
              {data.category.heroDescription}
            </p>
            {summary ? (
              <p className="text-sm font-medium text-teal">Filtros activos: {summary}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-[26px] border-ink/10 p-5">
              <p className="text-sm text-ink/68">Resultados visibles</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{data.totalCount}</p>
            </Card>
            <Card className="rounded-[26px] border-ink/10 p-5">
              <p className="text-sm text-ink/68">Categoria activa</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{data.category.label}</p>
            </Card>
          </div>
        </div>
      </Card>

      <UniversalSearch
        actionPath={data.category.href}
        categoryOptions={categoryOptions}
        defaultCategory={data.category.key === "all" ? data.category.key : undefined}
        defaultLocation={data.filters.location}
        defaultPrice={data.filters.priceRange}
        defaultQuery={data.filters.query}
        defaultRating={data.filters.minRating}
        locationOptions={data.options.locations}
        lockedServiceType={
          data.category.serviceType === "all" ? undefined : data.category.serviceType
        }
        placeholder={data.category.searchPlaceholder}
        priceOptions={data.options.priceRanges}
        ratingOptions={data.options.ratings}
        submitLabel="Aplicar filtros"
      />

      <section className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {categoryLinks.map((category) => {
            const isActive =
              category.serviceType === data.filters.serviceType ||
              (data.filters.serviceType === "all" && category.key === "all");

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-teal bg-teal text-white"
                    : "border-ink/10 bg-white text-ink hover:border-teal/30 hover:text-teal"
                }`}
                href={category.href}
                key={category.key}
              >
                {category.label}
              </Link>
            );
          })}
        </div>

        {data.businesses.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-ink/62">
              Necoclí: {data.totalCount} alojamiento{data.totalCount === 1 ? "" : "s"} encontrado
              {data.totalCount === 1 ? "" : "s"}
            </p>

            <PropertyTypeFilter baseHref={data.category.href} />

            <div className="flex flex-col gap-4">
              {data.businesses.map((business) => (
                <BookingBusinessCard key={business.id} business={business} />
              ))}
            </div>
          </div>
        ) : (
          <Card className="rounded-[30px] border-ink/10 p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              No encontramos resultados para estos filtros.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">
              Ajusta la ubicacion, el rango de precio o el rating para ampliar la busqueda dentro de
              nuestras empresas recomendadas.
            </p>
            <div className="mt-5">
              <Button href={data.category.href} size="lg" variant="secondary">
                Limpiar filtros
              </Button>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
