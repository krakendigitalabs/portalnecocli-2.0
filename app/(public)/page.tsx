import { AudienceSection } from "@/components/home/audience-section";
import { ContactSection } from "@/components/home/contact-section";
import { DirectorySection } from "@/components/home/directory-section";
import { HomeHero } from "@/components/home/home-hero";
import { ReservationCtaSection } from "@/components/home/reservation-cta-section";
import { ValuePropositionSection } from "@/components/home/value-proposition-section";
import { getCommercialHomeContent } from "@/lib/content/commercial-home";

export default async function PublicHomePage() {
  const commercialHomeContent = await getCommercialHomeContent();

  return (
    <div className="space-y-10 pb-14 pt-6 md:space-y-14 md:pt-10">
      <HomeHero content={commercialHomeContent.hero} />
      <ValuePropositionSection content={commercialHomeContent.valueProposition} />
      <AudienceSection content={commercialHomeContent.touristSection} />
      <AudienceSection content={commercialHomeContent.merchantSection} />
      <DirectorySection content={commercialHomeContent.directorySection} />
      <ReservationCtaSection content={commercialHomeContent.reservationCta} />
      <ContactSection content={commercialHomeContent.contactSection} />
    </div>
  );
}
