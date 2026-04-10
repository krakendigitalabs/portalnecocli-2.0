import { AudienceSection } from "@/components/home/audience-section";
import { ContactSection } from "@/components/home/contact-section";
import { FeaturedBusinessesSection } from "@/components/home/featured-businesses-section";
import { HomeHero } from "@/components/home/home-hero";
import { PromoBannerSection } from "@/components/home/promo-banner-section";
import { ReservationCtaSection } from "@/components/home/reservation-cta-section";
import { ValuePropositionSection } from "@/components/home/value-proposition-section";
import { getCommercialHomeContent } from "@/lib/content/commercial-home";
import { getFeaturedBusinesses } from "@/lib/content/featured-businesses";

export default async function PublicHomePage() {
  const commercialHomeContent = await getCommercialHomeContent();
  const featuredBusinesses = getFeaturedBusinesses(4);

  return (
    <div className="space-y-10 pb-14 pt-4 md:space-y-14 md:pt-8">
      <HomeHero content={commercialHomeContent.hero} />
      <PromoBannerSection content={commercialHomeContent.showcaseSection} />
      <ValuePropositionSection content={commercialHomeContent.valueProposition} />
      <FeaturedBusinessesSection businesses={featuredBusinesses} />
      <AudienceSection content={commercialHomeContent.touristSection} />
      <PromoBannerSection
        content={commercialHomeContent.bonusSection}
        id="bonos"
        tone="dark"
      />
      <AudienceSection content={commercialHomeContent.merchantSection} />
      <ReservationCtaSection content={commercialHomeContent.reservationCta} />
      <ContactSection content={commercialHomeContent.contactSection} />
    </div>
  );
}
