import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessAccessLinks } from "@/components/marketplace/business-access-links";
import { BusinessCategoryBadge } from "@/components/marketplace/business-category-badge";
import { BusinessCTAGroup } from "@/components/marketplace/business-cta-group";
import { BusinessMetaList } from "@/components/marketplace/business-meta-list";
import { FeaturedBusinessGrid } from "@/components/marketplace/featured-business-grid";
import { Card } from "@/components/ui/card";
import {
  getAllBusinesses,
  getBusinessBySlug,
  getRelatedBusinessesForDetail,
} from "@/lib/content/featured-businesses";
import { getMarketplaceListingHref } from "@/lib/content/marketplace";
import { siteMetadata } from "@/lib/constants/site";

type BusinessDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllBusinesses().map((business) => ({
    slug: business.slug,
  }));
}

export async function generateMetadata({
  params,
}: BusinessDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const business = getBusinessBySlug(resolvedParams.slug);

  if (!business) {
    return {
      title: "Negocio no encontrado | Portal Necocli 2.0",
    };
  }

  return {
    title: `${business.name} en Necocli | Portal Necocli 2.0`,
    description: `${business.shortDescription} Contacta ${business.name} por WhatsApp, llamada o mapa desde el directorio de negocios de Necocli.`,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/negocios/${business.slug}`,
    },
    openGraph: {
      title: `${business.name} en Necocli | Portal Necocli 2.0`,
      description: business.shortDescription,
      url: `${siteMetadata.siteUrl}/negocios/${business.slug}`,
      images: [
        {
          url: business.image,
          alt: business.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.name} en Necocli | Portal Necocli 2.0`,
      description: business.shortDescription,
      images: [business.image],
    },
  };
}

export default async function BusinessDetailPage({
  params,
}: BusinessDetailPageProps) {
  const resolvedParams = await params;
  const business = getBusinessBySlug(resolvedParams.slug);

  if (!business) {
    notFound();
  }

  const relatedBusinesses = getRelatedBusinessesForDetail(business);
  const listingHref = getMarketplaceListingHref(business.serviceType);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.shortDescription,
    image: `${siteMetadata.siteUrl}${business.image}`,
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    url: `${siteMetadata.siteUrl}/negocios/${business.slug}`,
    sameAs: business.socialLinks?.map((link) => link.href),
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: siteMetadata.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Negocios",
        item: `${siteMetadata.siteUrl}/negocios`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: business.name,
        item: `${siteMetadata.siteUrl}/negocios/${business.slug}`,
      },
    ],
  };

  return (
    <div className="space-y-8 pb-14 pt-6 md:space-y-10 md:pt-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
        type="application/ld+json"
      />
      <div className="space-y-4">
        <Link
          className="inline-flex items-center text-sm font-semibold text-teal transition hover:text-coral"
          href={listingHref}
        >
          Volver al listado
        </Link>
        <p className="text-sm text-ink/58">
          Negocios en Necoclí / {business.category} / {business.name}
        </p>
        <BusinessCategoryBadge
          category={business.category}
          serviceType={business.serviceType}
        />
        <div className="space-y-4">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {business.name}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-ink/72 md:text-lg">
            {business.longDescription}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden rounded-[34px] border-ink/10">
          <div className="aspect-[1.35/1] overflow-hidden bg-sand">
            <img
              alt={business.name}
              className="h-full w-full object-cover"
              src={business.image}
            />
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="rounded-[30px] border-ink/10 p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
              Acciones directas
            </p>
            <div className="mt-4 space-y-4">
              <BusinessAccessLinks business={business} />
              <BusinessCTAGroup business={business} />
            </div>
            {business.socialLinks?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {business.socialLinks.map((link) => (
                  <a
                    key={`${business.id}-${link.platform}`}
                    className="inline-flex items-center rounded-full border border-ink/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/70 transition hover:border-teal/30 hover:text-teal"
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.platform === "website"
                      ? "Sitio"
                      : link.platform.charAt(0).toUpperCase() +
                        link.platform.slice(1)}
                  </a>
                ))}
              </div>
            ) : null}
          </Card>
          <BusinessMetaList business={business} />
        </div>
      </div>

      {business.gallery?.length ? (
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
            Galería referencial
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {business.gallery.map((image) => (
              <Card
                key={image}
                className="overflow-hidden rounded-[28px] border-ink/10"
              >
                <div className="aspect-[1.3/1] overflow-hidden bg-sand">
                  <img
                    alt={`${business.name} referencia visual`}
                    className="h-full w-full object-cover"
                    src={image}
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
          Lo que ofrece este negocio
        </p>
        <div className="flex flex-wrap gap-2">
          {business.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-ink/6 px-4 py-2 text-sm font-medium text-ink/76"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section aria-label="Negocios relacionados" className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
            Otros negocios relacionados
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            Sigue explorando negocios cercanos a esta necesidad.
          </h2>
        </div>
        {relatedBusinesses.length > 0 ? (
          <FeaturedBusinessGrid businesses={relatedBusinesses} />
        ) : (
          <Card className="rounded-[28px] border-ink/10 p-6">
            <p className="text-base leading-7 text-ink/70">
              Aún no hay más negocios relacionados visibles en esta categoría.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
