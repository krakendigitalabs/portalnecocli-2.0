import Link from "next/link";
import type { Metadata } from "next";
import { FeaturedBusinessGrid } from "@/components/marketplace/featured-business-grid";
import { BusinessCategoryBadge } from "@/components/marketplace/business-category-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getBusinessServiceTypeOptions,
  getBusinessesByFilters,
} from "@/lib/content/featured-businesses";
import { getServiceTypeLabel } from "@/lib/utils/business-links";

export const metadata: Metadata = {
  title: "Negocios en Necocli | Portal Necocli 2.0",
  description:
    "Explora hoteles, restaurantes, tours, transporte y comercios destacados en Necocli con accesos directos a WhatsApp, llamada y mapa.",
  openGraph: {
    title: "Negocios en Necocli | Portal Necocli 2.0",
    description:
      "Explora hoteles, restaurantes, tours, transporte y comercios destacados en Necocli con accesos directos a WhatsApp, llamada y mapa.",
    url: "https://portalnecocli.com/negocios",
  },
};

type BusinessesDirectoryPageProps = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
  }>;
};

export default async function BusinessesDirectoryPage({
  searchParams,
}: BusinessesDirectoryPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams?.category ?? "all";
  const query = resolvedSearchParams?.q ?? "";
  const businesses = getBusinessesByFilters({
    query,
    serviceType: activeCategory,
  });
  const categoryOptions = getBusinessServiceTypeOptions();
  const buildFilterHref = (category?: string) => {
    const params = new URLSearchParams();

    if (category && category !== "all") {
      params.set("category", category);
    }

    if (query) {
      params.set("q", query);
    }

    const suffix = params.toString();

    return suffix ? `/negocios?${suffix}` : "/negocios";
  };

  return (
    <div className="space-y-8 pb-14 pt-6 md:space-y-10 md:pt-10">
      <Card className="overflow-hidden rounded-[36px] border-ink/10">
        <div className="grid gap-6 bg-hero-glow px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
              Explora negocios en Necoclí
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Un directorio pensado para descubrir rápido, comparar mejor y
              contactar sin fricción.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-ink/72">
              Esta página organiza negocios destacados del ecosistema local en
              una experiencia más clara: filtros básicos, fichas accionables y
              rutas directas hacia reserva, llamada, pedido o ubicación.
            </p>
            {query ? (
              <p className="text-sm font-medium text-teal">
                Buscando: "{query}"
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-[26px] border-ink/10 p-5">
              <p className="text-sm text-ink/68">Categorias activas</p>
              <p className="mt-2 text-3xl font-semibold text-ink">
                {categoryOptions.length}
              </p>
            </Card>
            <Card className="rounded-[26px] border-ink/10 p-5">
              <p className="text-sm text-ink/68">Negocios visibles</p>
              <p className="mt-2 text-3xl font-semibold text-ink">
                {businesses.length}
              </p>
            </Card>
          </div>
        </div>
      </Card>

      <section className="space-y-5">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
            Filtros básicos
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === "all"
                  ? "border-teal bg-teal text-white"
                  : "border-ink/10 bg-white text-ink hover:border-teal/30 hover:text-teal"
              }`}
              href={buildFilterHref("all")}
            >
              Todos
            </Link>
            {categoryOptions.map((option) => (
              <Link
                key={option}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === option
                    ? "border-teal bg-teal text-white"
                    : "border-ink/10 bg-white text-ink hover:border-teal/30 hover:text-teal"
                }`}
                href={buildFilterHref(option)}
              >
                {getServiceTypeLabel(option)}
              </Link>
            ))}
          </div>
        </div>

        {businesses.length > 0 ? (
          <FeaturedBusinessGrid businesses={businesses} />
        ) : (
          <Card className="rounded-[30px] border-ink/10 p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              No hay negocios para este filtro.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">
              Prueba otra categoría o vuelve al listado completo para explorar
              el ecosistema comercial disponible.
              {query ? ` No encontramos coincidencias para "${query}".` : ""}
            </p>
            <div className="mt-5">
              <Button href="/negocios" size="lg" variant="secondary">
                Ver todos
              </Button>
            </div>
          </Card>
        )}
      </section>

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
          Cobertura del directorio
        </p>
        <div className="flex flex-wrap gap-3">
          {categoryOptions.map((option) => (
            <BusinessCategoryBadge
              key={option}
              category="Negocio destacado"
              serviceType={option}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
