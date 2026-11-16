import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessAccessLinks } from "@/components/marketplace/business-access-links";
import { BusinessCategoryBadge } from "@/components/marketplace/business-category-badge";
import { BusinessCTAGroup } from "@/components/marketplace/business-cta-group";
import { BusinessMetaList } from "@/components/marketplace/business-meta-list";
import { FeaturedBusinessGrid } from "@/components/marketplace/featured-business-grid";
import { RecentViewerTracker } from "@/components/marketplace/recent-viewer-tracker";
import { Card } from "@/components/ui/card";
import { siteMetadata } from "@/lib/constants/site";
import {
  getAllBusinesses,
  getBusinessBySlug,
  getRelatedBusinessesForDetail,
} from "@/lib/content/featured-businesses";
import { getMarketplaceListingHref } from "@/lib/content/marketplace";
import { BusinessHeroGallery } from "@/components/marketplace/business-hero-gallery";
import { MapPin, Star, Share, Heart, Award } from "lucide-react";

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

export async function generateMetadata({ params }: BusinessDetailPageProps): Promise<Metadata> {
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

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const resolvedParams = await params;
  const business = getBusinessBySlug(resolvedParams.slug);

  if (!business) {
    notFound();
  }

  const relatedBusinesses = getRelatedBusinessesForDetail(business);
  const listingHref = getMarketplaceListingHref(business.serviceType);

  // Validación de categoría para visualización de precios
  const categoryLower = (business.category || business.propertyType || "").toLowerCase();
  const isHotel = categoryLower.includes("hotel") || categoryLower.includes("hospedaje") || categoryLower.includes("alojamiento");

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
    <div className="pb-20 md:pb-32 bg-white">
      <RecentViewerTracker businessId={business.id} />
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

      {/* HEADER SECTION (Title, Rating, Location, Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <h1 className="text-3xl md:text-[2rem] lg:text-4xl font-semibold tracking-tight text-slate-900 mb-2 font-display">
          {business.name}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center text-sm font-medium text-slate-700 gap-x-4 gap-y-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
              <span className="font-semibold text-slate-900">{business.rating || "4.8"}</span>
              <span className="text-slate-500 underline cursor-pointer hover:text-slate-900 ml-1">
                {business.reviewCount || 120} evaluaciones
              </span>
            </div>

            <span className="hidden sm:inline text-slate-300">•</span>

            {business.isGenius && (
              <>
                <div className="flex items-center gap-1 text-rose-600">
                  <Award className="w-4 h-4" />
                  <span>Favorito de los viajeros</span>
                </div>
                <span className="hidden sm:inline text-slate-300">•</span>
              </>
            )}

            <div className="flex items-center gap-1 underline cursor-pointer hover:text-slate-900">
              <MapPin className="w-4 h-4" />
              <span>{business.city}, Antioquia, Colombia</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <button className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-md transition-colors underline decoration-transparent hover:decoration-slate-900">
              <Share className="w-4 h-4" /> Compartir
            </button>
            <button className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-md transition-colors underline decoration-transparent hover:decoration-slate-900">
              <Heart className="w-4 h-4" /> Guardar
            </button>
          </div>
        </div>
      </div>

      {/* HERO GALLERY */}
      <div className="px-0 sm:px-4 lg:px-8">
        <BusinessHeroGallery
          name={business.name}
          mainImage={business.image}
          gallery={business.gallery}
        />
      </div>

      {/* MAIN CONTENT 2-COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-24">
          {/* LEFT COLUMN: DESCRIPTION & INFO */}
          <div className="space-y-12">
            {/* Hosted By & Category */}
            <div className="flex items-center justify-between pb-8 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-1 font-display">
                  {business.propertyType || business.category} en Necoclí
                </h2>
                <p className="text-slate-500 text-base">{business.shortDescription}</p>
              </div>
              <BusinessCategoryBadge
                category={business.category}
                serviceType={business.serviceType}
              />
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none text-slate-700">
              <p className="text-[1.05rem] leading-[1.8] font-light">{business.longDescription}</p>
            </div>

            {/* Amenities/Tags */}
            <div className="pt-8 border-t border-slate-200">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 font-display">
                Lo que ofrece este lugar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                {business.tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-4 text-slate-700">
                    <svg
                      className="w-6 h-6 text-slate-400 stroke-[1.5]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-light text-[1.05rem]">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="pt-8 border-t border-slate-200">
              <h3 className="text-2xl font-semibold text-slate-900 mb-2 font-display">
                Dónde estarás
              </h3>
              <p className="text-slate-600 mb-6 font-light">
                {business.address}, {business.neighborhood}
              </p>

              <div className="w-full h-[400px] bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="text-center z-10 p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl transition-transform group-hover:scale-105 duration-500 border border-slate-100">
                  <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-7 h-7 text-teal-600" />
                  </div>
                  <p className="font-semibold text-slate-900 text-lg">Ver ubicación exacta</p>
                  <a
                    href={business.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-slate-500 hover:text-teal-600 transition-colors mt-1 block"
                  >
                    Abrir en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR (BOOKING/ACTIONS) */}
          <div className="relative">
            <div className="sticky top-28 space-y-6">
              <Card className="rounded-[28px] border-slate-200/60 p-6 md:p-8 shadow-2xl shadow-slate-200/50 bg-white">
                {/* PRECIO ADAPTATIVO: SOLO MOSTRAR PRECIO SI ES HOTEL */}
                {isHotel && (business.priceRange || business.numericPrice) ? (
                  <div className="mb-6 flex items-end gap-1.5">
                    <span className="text-[1.75rem] font-bold text-slate-900 leading-none">
                      {business.numericPrice
                        ? `$${business.numericPrice.toLocaleString("es-CO")}`
                        : business.priceRange}
                    </span>
                    <span className="text-slate-500 font-medium">COP / noche</span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold uppercase rounded-full tracking-wide">
                      Servicio Directo / Cotización
                    </span>
                  </div>
                )}

                <BusinessAccessLinks business={business} />

                <div className="my-6">
                  <div className="w-full h-px bg-slate-100" />
                </div>

                <BusinessCTAGroup business={business} />

                <div className="mt-6 text-center">
                  <span className="text-[13px] text-slate-500">
                    No se cobrará ningún cargo por solicitar info
                  </span>
                </div>

                {business.socialLinks?.length ? (
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-center gap-2">
                    {business.socialLinks.map((link) => (
                      <a
                        key={`${business.id}-${link.platform}`}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                        href={link.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {link.platform === "website" ? "Sitio Web" : link.platform}
                      </a>
                    ))}
                  </div>
                ) : null}
              </Card>

              {/* Badges de Garantía (Estilo premium) */}
              <div className="flex flex-col gap-4 px-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Reserva Segura</h4>
                    <p className="text-[13px] text-slate-500">
                      Transacciones protegidas con Escrow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <BusinessMetaList business={business} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED BUSINESSES */}
      {relatedBusinesses.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-slate-200">
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-[1.75rem] font-semibold text-slate-900 font-display">
                Sigue explorando en {business.category}
              </h2>
              <p className="text-slate-500 font-light text-lg">
                Descubre otras joyas ocultas que podrían interesarte en Necoclí.
              </p>
            </div>

            <FeaturedBusinessGrid businesses={relatedBusinesses} />

            <div className="pt-8">
              <Link
                className="inline-flex items-center text-sm font-semibold text-slate-900 transition hover:opacity-70 underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4"
                href={listingHref}
              >
                Ver todos los negocios
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}