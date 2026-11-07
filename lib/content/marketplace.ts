import { getCachedMarketplaceBusinesses } from "@/app/actions/marketplace";
import { getServiceTypeLabel } from "@/lib/utils/business-links";
import type { BusinessServiceType, FeaturedBusiness } from "@/types/featured-business";
import type {
  MarketplaceCategory,
  MarketplaceCategoryKey,
  MarketplaceFilterOptions,
  MarketplaceFilters,
  MarketplaceListingData,
  MarketplaceSearchParams,
} from "@/types/marketplace";

const marketplaceCategories: MarketplaceCategory[] = [
  {
    key: "all",
    label: "Todas las empresas",
    shortLabel: "Todo",
    description:
      "Un solo punto para explorar hospedajes, restaurantes, experiencias y transporte local.",
    href: "/negocios",
    serviceType: "all",
    heroTitle: "Empresas recomendadas en Necoclí",
    heroDescription:
      "Descubre negocios y experiencias con filtros útiles, navegación clara y fichas listas para convertir.",
    searchPlaceholder: "Busca hoteles, restaurantes, tours o transporte",
  },
  {
    key: "hoteles",
    label: "Hoteles y alojamientos",
    shortLabel: "Stay",
    description:
      "Hospedajes frente al mar, hoteles boutique y cabañas preparadas para reserva directa.",
    href: "/hoteles",
    serviceType: "hotel",
    heroTitle: "Hoteles en Necoclí",
    heroDescription:
      "Encuentra alojamientos por ubicación, rango de precio y calificación para reservar con más contexto.",
    searchPlaceholder: "Busca hoteles, cabañas o alojamientos",
  },
  {
    key: "restaurantes",
    label: "Restaurantes y cocina local",
    shortLabel: "Food",
    description: "Comida costera, mesas para grupos y opciones para pedir o reservar sin fricción.",
    href: "/restaurantes",
    serviceType: "restaurante",
    heroTitle: "Restaurantes en Necoclí",
    heroDescription:
      "Explora cocina local y propuestas gastronómicas con filtros por zona, precio y reputación.",
    searchPlaceholder: "Busca restaurantes, marisquerías o cocina local",
  },
  {
    key: "tours",
    label: "Tours y experiencias",
    shortLabel: "Tours",
    description:
      "Operadores turísticos, salidas guiadas y actividades para descubrir playa y manglar en Necoclí.",
    href: "/tours",
    serviceType: "turismo",
    heroTitle: "Tours y experiencias en Necoclí",
    heroDescription:
      "Filtra experiencias por tipo, punto de encuentro y calificación antes de reservar.",
    searchPlaceholder: "Busca tours, experiencias o salidas guiadas",
  },
  {
    key: "transporte",
    label: "Transporte turístico",
    shortLabel: "Move",
    description:
      "Traslados, rutas de conexión y movilidad local para turistas, grupos y comercios.",
    href: "/transporte",
    serviceType: "transporte",
    heroTitle: "Transporte en Necoclí",
    heroDescription:
      "Compara servicios de traslado por cobertura, precio y calificación antes de coordinar tu ruta.",
    searchPlaceholder: "Busca traslados, rutas o transporte turístico",
  },
];

const ratingOptions = [5, 4, 3];
const supportedServiceTypes: Array<BusinessServiceType | "all"> = [
  "all",
  "hotel",
  "restaurante",
  "comercio",
  "transporte",
  "turismo",
  "domicilios",
];

function normalizeText(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeRating(value?: string) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function getLocationLabel(business: FeaturedBusiness) {
  return business.neighborhood ?? business.city;
}

function getDefaultFilters(): MarketplaceFilters {
  return {
    query: "",
    serviceType: "all",
    location: null,
    priceRange: null,
    minRating: null,
  };
}

export async function getMarketplaceCategories() {
  const businesses = await getCachedMarketplaceBusinesses();

  return marketplaceCategories.map((category) => {
    const totalCount =
      category.serviceType === "all"
        ? businesses.length
        : businesses.filter((business) => business.serviceType === category.serviceType).length;

    return {
      ...category,
      metric: `${totalCount} resultado${totalCount === 1 ? "" : "s"}`,
    };
  });
}

export function getMarketplaceCategoryByKey(key: MarketplaceCategoryKey = "all") {
  return marketplaceCategories.find((category) => category.key === key) ?? marketplaceCategories[0];
}

function isSupportedServiceType(value: string): value is BusinessServiceType | "all" {
  return supportedServiceTypes.includes(value as BusinessServiceType | "all");
}

function resolveRequestedServiceType(value?: string) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();
  const categoryMatch = marketplaceCategories.find((category) => category.key === normalizedValue);

  if (categoryMatch) {
    return categoryMatch.serviceType;
  }

  if (isSupportedServiceType(normalizedValue)) {
    return normalizedValue;
  }

  return null;
}

export function getMarketplaceCategoryByServiceType(serviceType: BusinessServiceType | "all") {
  const matchingCategory = marketplaceCategories.find(
    (category) => category.serviceType === serviceType,
  );

  if (matchingCategory) {
    return matchingCategory;
  }

  if (serviceType === "all") {
    return marketplaceCategories[0];
  }

  const label = getServiceTypeLabel(serviceType);

  return {
    key: "all" as const,
    label,
    shortLabel: label,
    description: `Resultados filtrados por ${label.toLowerCase()} en nuestras empresas recomendadas.`,
    href: `/negocios?category=${serviceType}`,
    serviceType,
    heroTitle: `${label} en Necocli`,
    heroDescription:
      "Explora resultados filtrados de empresas recomendadas con fichas listas para contactar.",
    searchPlaceholder: `Busca opciones de ${label.toLowerCase()}`,
  };
}

export function getMarketplaceListingHref(serviceType: BusinessServiceType | "all") {
  return getMarketplaceCategoryByServiceType(serviceType).href;
}

export function getMarketplaceSearchFilters(
  searchParams?: MarketplaceSearchParams,
  defaults: Partial<MarketplaceFilters> = {},
): MarketplaceFilters {
  const initialFilters = {
    ...getDefaultFilters(),
    ...defaults,
  };
  const requestedServiceType = resolveRequestedServiceType(searchParams?.category);
  const resolvedCategory =
    initialFilters.serviceType === "all" && requestedServiceType
      ? requestedServiceType
      : initialFilters.serviceType;

  return {
    query: searchParams?.q?.trim() ?? initialFilters.query,
    serviceType: resolvedCategory,
    location: searchParams?.location?.trim() || initialFilters.location,
    priceRange: searchParams?.price?.trim() || initialFilters.priceRange,
    minRating: searchParams?.rating
      ? normalizeRating(searchParams.rating)
      : initialFilters.minRating,
  };
}

export async function getMarketplaceBusinesses(filters: MarketplaceFilters) {
  const query = normalizeText(filters.query);
  const allBusinesses = await getCachedMarketplaceBusinesses();

  return allBusinesses.filter((business) => {
    if (filters.serviceType !== "all" && business.serviceType !== filters.serviceType) {
      return false;
    }

    if (
      filters.location &&
      normalizeText(getLocationLabel(business)) !== normalizeText(filters.location)
    ) {
      return false;
    }

    if (filters.priceRange && business.priceRange !== filters.priceRange) {
      return false;
    }

    if (
      filters.minRating !== null &&
      (typeof business.rating !== "number" || business.rating < filters.minRating)
    ) {
      return false;
    }

    if (!query) {
      return true;
    }

    const searchableFields = [
      business.name,
      business.category,
      business.shortDescription,
      business.longDescription,
      business.city,
      business.neighborhood,
      business.address,
      getLocationLabel(business),
      getServiceTypeLabel(business.serviceType),
      ...business.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableFields.includes(query);
  });
}

export async function getMarketplaceFilterOptions(
  serviceType: BusinessServiceType | "all" = "all",
): Promise<MarketplaceFilterOptions> {
  const allBusinesses = await getCachedMarketplaceBusinesses();
  const scopedBusinesses =
    serviceType === "all"
      ? allBusinesses
      : allBusinesses.filter((business) => business.serviceType === serviceType);

  return {
    locations: Array.from(
      new Set(scopedBusinesses.map(getLocationLabel).filter(isNonEmptyString)),
    ).sort(),
    priceRanges: Array.from(
      new Set(scopedBusinesses.map((business) => business.priceRange).filter(isNonEmptyString)),
    ).sort(),
    ratings: ratingOptions,
  };
}

export async function getMarketplaceListingData(
  searchParams?: MarketplaceSearchParams,
  defaults: Partial<MarketplaceFilters> = {},
): Promise<MarketplaceListingData> {
  const filters = getMarketplaceSearchFilters(searchParams, defaults);
  const businesses = await getMarketplaceBusinesses(filters);
  const category = getMarketplaceCategoryByServiceType(filters.serviceType);
  const options = await getMarketplaceFilterOptions(filters.serviceType);

  return {
    filters,
    businesses,
    totalCount: businesses.length,
    options,
    category,
  };
}

export async function getFeaturedMarketplaceBusinesses(limit = 6) {
  const allBusinesses = await getCachedMarketplaceBusinesses();
  return allBusinesses
    .filter((business) => business.featured && business.serviceType !== "turismo")
    .slice(0, limit);
}

export async function getFeaturedExperiences(limit = 3) {
  const allBusinesses = await getCachedMarketplaceBusinesses();
  return allBusinesses
    .filter((business) => business.serviceType === "turismo" && business.featured)
    .slice(0, limit);
}

export function getMarketplaceSearchSummary(filters: MarketplaceFilters) {
  const parts = [
    filters.query ? `búsqueda "${filters.query}"` : null,
    filters.location ? `zona ${filters.location}` : null,
    filters.priceRange ? `precio ${filters.priceRange}` : null,
    filters.minRating ? `rating ${filters.minRating}+` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : null;
}
