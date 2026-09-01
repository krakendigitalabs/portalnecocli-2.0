export type BusinessServiceType =
  | "hotel"
  | "restaurante"
  | "comercio"
  | "transporte"
  | "turismo"
  | "domicilios";

export type BusinessSocialPlatform = "instagram" | "facebook" | "tiktok" | "website";

export type BusinessSocialLink = {
  platform: BusinessSocialPlatform;
  href: string;
};

export type BusinessHoursEntry = {
  day: string;
  open?: string;
  close?: string;
  closed?: boolean;
};

export type PropertyType =
  | "Hotel"
  | "Apartamento"
  | "Resort"
  | "Villa"
  | "Hostal"
  | "Casa Hotel"
  | "Restaurante"
  | "Operador"
  | "Transporte";

export type FeaturedBusiness = {
  id: string;
  slug: string;
  tenantId: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  gallery?: string[];
  tags: string[];
  address: string;
  neighborhood?: string;
  city: string;
  phone: string;
  whatsapp: string;
  email?: string;
  website?: string;
  socialLinks?: BusinessSocialLink[];
  rating?: number;
  priceRange?: string;
  businessHours?: BusinessHoursEntry[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  mapLink: string;
  featured: boolean;
  serviceType: BusinessServiceType;
  propertyType?: PropertyType;
  reviewCount?: number;
  ratingLabel?: string;
  isGenius?: boolean;
  numericPrice?: number;
};
