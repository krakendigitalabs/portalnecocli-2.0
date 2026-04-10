export type ContentLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type HeroSlide = {
  image: string;
  alt: string;
  title: string;
  label: string;
};

export type ValuePoint = {
  title: string;
  description: string;
};

export type AudienceStep = {
  title: string;
  description: string;
  cta?: ContentLink;
};

export type AudienceSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  steps: AudienceStep[];
};

export type RecommendedListing = {
  id: string;
  name: string;
  category: string;
  summary: string;
  location: string;
  priceLabel: string;
  tags: string[];
  cta: ContentLink;
};

export type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type PromoBanner = {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  label: string;
};

export type CommercialHomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: ContentLink;
    secondaryCta: ContentLink;
    stats: HeroStat[];
    slides: HeroSlide[];
  };
  valueProposition: {
    eyebrow: string;
    title: string;
    description: string;
    points: ValuePoint[];
  };
  touristSection: AudienceSection;
  merchantSection: AudienceSection;
  directorySection: {
    eyebrow: string;
    title: string;
    description: string;
    listings: RecommendedListing[];
  };
  showcaseSection: {
    eyebrow: string;
    title: string;
    description: string;
    items: PromoBanner[];
  };
  bonusSection: {
    eyebrow: string;
    title: string;
    description: string;
    items: PromoBanner[];
  };
  reservationCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: ContentLink;
    secondaryCta: ContentLink;
  };
  contactSection: {
    eyebrow: string;
    title: string;
    description: string;
    contactItems: ContactItem[];
    socialLinks: SocialLink[];
  };
};
