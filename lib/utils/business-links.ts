import type { BusinessServiceType, FeaturedBusiness } from "@/types/featured-business";

type BusinessSeedInput = Omit<
  FeaturedBusiness,
  "mapLink" | "ctaPrimaryHref" | "ctaSecondaryHref" | "website" | "socialLinks"
> & {
  mapQuery: string;
  ctaPrimaryValue: string;
  ctaSecondaryValue: string;
  website?: string;
  socialLinks?: FeaturedBusiness["socialLinks"];
};

export function normalizePhoneNumber(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function createPhoneHref(phone: string) {
  return `tel:${normalizePhoneNumber(phone)}`;
}

export function createWhatsAppHref(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");

  if (!message) {
    return `https://wa.me/${digits}`;
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function createMapHref(mapQuery: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}

export function createBusinessSeed(input: BusinessSeedInput): FeaturedBusiness {
  return {
    ...input,
    website: input.website ? normalizeGenericHref(input.website) : undefined,
    socialLinks: input.socialLinks?.map((link) => ({
      ...link,
      href: normalizeGenericHref(link.href),
    })),
    mapLink: createMapHref(input.mapQuery),
    ctaPrimaryHref: getNormalizedBusinessHref(input.ctaPrimaryValue, input.serviceType, input.name),
    ctaSecondaryHref: getNormalizedBusinessHref(
      input.ctaSecondaryValue,
      input.serviceType,
      input.name,
    ),
  };
}

export function getRelatedBusinesses(
  businesses: FeaturedBusiness[],
  currentBusiness: FeaturedBusiness,
  limit = 3,
) {
  return businesses
    .filter((business) => business.slug !== currentBusiness.slug)
    .sort((left, right) => {
      const leftScore =
        Number(left.serviceType === currentBusiness.serviceType) +
        Number(left.category === currentBusiness.category);
      const rightScore =
        Number(right.serviceType === currentBusiness.serviceType) +
        Number(right.category === currentBusiness.category);

      return rightScore - leftScore;
    })
    .slice(0, limit);
}

export function getBusinessFilterOptions(businesses: FeaturedBusiness[]) {
  return Array.from(new Set(businesses.map((business) => business.serviceType)));
}

export function getServiceTypeLabel(serviceType: BusinessServiceType) {
  const labels: Record<BusinessServiceType, string> = {
    hotel: "Hoteleria",
    restaurante: "Restaurante",
    comercio: "Comercio",
    transporte: "Transporte",
    turismo: "Turismo",
    domicilios: "Domicilios",
  };

  return labels[serviceType];
}

function normalizeGenericHref(value: string) {
  if (/^[a-z]+:/i.test(value) || value.startsWith("http")) {
    return value;
  }

  return `https://${value}`;
}

function getNormalizedBusinessHref(
  value: string,
  serviceType: BusinessServiceType,
  businessName: string,
) {
  if (value.startsWith("wa:")) {
    return createWhatsAppHref(
      value.replace("wa:", ""),
      getWhatsAppMessageByServiceType(serviceType, businessName),
    );
  }

  if (value.startsWith("tel:")) {
    return createPhoneHref(value.replace("tel:", ""));
  }

  if (value.startsWith("map:")) {
    return createMapHref(value.replace("map:", ""));
  }

  return normalizeGenericHref(value);
}

function getWhatsAppMessageByServiceType(serviceType: BusinessServiceType, businessName: string) {
  const prefixByServiceType: Record<BusinessServiceType, string> = {
    hotel: "Hola, quiero reservar hospedaje en",
    restaurante: "Hola, quiero pedir informacion sobre el menu de",
    comercio: "Hola, quiero conocer la oferta de",
    transporte: "Hola, necesito coordinar un traslado con",
    turismo: "Hola, quiero reservar una experiencia con",
    domicilios: "Hola, quiero registrar un pedido con",
  };

  return `${prefixByServiceType[serviceType]} ${businessName} en Necocli.`;
}
