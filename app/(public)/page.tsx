import { CategoryCard3D } from "@/components/marketplace/category-card-3d";
import { LogoMarquee } from "@/components/marketplace/logo-marquee";
import { LuxuryHero } from "@/components/marketplace/luxury-hero";
import { PhotoGallery } from "@/components/marketplace/photo-gallery";
import { WelcomeModal } from "@/components/marketplace/welcome-modal";
import { Container } from "@/components/ui/container";
import { businessCategories } from "@/data/categories";
import {
  getFeaturedExperiences,
  getFeaturedMarketplaceBusinesses,
  getMarketplaceCategories,
  getMarketplaceFilterOptions,
} from "@/lib/content/marketplace";

export default async function PublicHomePage() {
  const marketplaceCategories = await getMarketplaceCategories();
  const homeCategories = businessCategories
    .filter((category) => category.slug !== "delivery")
    .map((category) => {
      const match = marketplaceCategories.find((item) => item.href === category.href);

      return {
        ...category,
        metric: match?.metric,
      };
    });
  const featuredBusinesses = await getFeaturedMarketplaceBusinesses(6);
  const featuredExperiences = await getFeaturedExperiences(3);
  const filterOptions = await getMarketplaceFilterOptions();

  return (
    <div className="pb-14">
      {/* Luxury Hero full bleed */}
      <LuxuryHero />

      {/* Massive Edge-to-Edge Grid for Categories (WebGL 3D) */}
      <section className="w-full max-w-[2400px] mx-auto px-4 md:px-8 xl:px-12 mt-20 mb-20">
        <div className="mb-10 lg:mb-16 px-2 lg:px-4 flex flex-col items-center text-center">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-ink mb-6">
            Empresas recomendadas
          </h2>
          <p className="text-xl lg:text-2xl text-ink/70 max-w-3xl">
            Siente el ecosistema de Necoclí. Cada tarjeta es un portal interactivo hacia tu próxima
            experiencia premium.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-4 w-full">
          {homeCategories.map((category) => (
            <CategoryCard3D category={category} key={category.slug} />
          ))}
        </div>
      </section>

      <PhotoGallery />

      <LogoMarquee />

      {/* ─── Sección comercial de invitación ─── */}
      <section className="py-20 bg-white">
        <Container className="max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-teal font-bold tracking-[0.2em] uppercase text-xs mb-3">
              Necoclí · Colombia
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-ink mb-5 leading-tight">
              Necoclí te espera —<br />
              <span className="text-green">¿Cuándo vienes?</span>
            </h2>
            <p className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed">
              Un destino que mezcla mar dulce, cultura viva y sabores únicos del Caribe colombiano.
              Aquí cada día es una experiencia irrepetible.
            </p>
          </div>

          {/* 3 cards comerciales */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Turismo local */}
            <div className="group relative rounded-[32px] overflow-hidden h-[380px] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img
                src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1739291734/turismo_necocli_111_hwcnic.jpg"
                alt="Turismo local en Necoclí"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span className="inline-block bg-teal/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  Turismo Local
                </span>
                <h3 className="text-2xl font-bold text-white mb-2 font-tropical">
                  Aventura en Necoclí
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  Playas vírgenes, manglares y el mar dulce más grande del mundo. Tours en lancha.
                </p>
              </div>
            </div>

            {/* Sitios culturales */}
            <div className="group relative rounded-[32px] overflow-hidden h-[380px] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img
                src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003485/turismo_necocli_35_c81lmu.jpg"
                alt="Sitios culturales de Necoclí"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span className="inline-block bg-gold/90 text-ink text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  Cultura & Patrimonio
                </span>
                <h3 className="text-2xl font-bold text-white mb-2 font-tropical">Historia Viva</h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  Malecón, Casa de nuestras culturas, Cabaña Portal Necocli,Remate
                  siglos de historias junto al mar.
                </p>
              </div>
            </div>

            {/* Gastronomía */}
            <div className="group relative rounded-[32px] overflow-hidden h-[380px] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <img
                src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1754277470/plato_4_akdkbk.jpg"
                alt="Gastronomía de Necoclí"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span className="inline-block bg-coral/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  Gastronomía
                </span>
                <h3 className="text-2xl font-bold text-white mb-2 font-tropical">
                  Sabores del Caribe
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  Langosta, pargo frito, cazuela de mariscos y cocadas artesanales. El mar llega
                  directo a tu plato en Necoclí.
                </p>
              </div>
            </div>
          </div>

          {/* CTA central */}
          <div className="mt-14 text-center">
            <a
              href="/turistas"
              className="inline-flex items-center gap-3 bg-green text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-green/25 hover:bg-green/90 transition-all hover:-translate-y-1 active:scale-95"
            >
              🌊 Planea tu viaje a Necoclí
              <span className="text-lg">→</span>
            </a>
            <p className="mt-4 text-sm text-ink/40">
              Paquetes desde <span className="font-bold text-ink/70">$50.000 COP</span> · Reserva en
              minutos
            </p>
          </div>
        </Container>
      </section>

      {/* Lead Magnet */}
      <WelcomeModal />
    </div>
  );
}
