import "server-only";
import { EscrowRepo } from "@/lib/data/repositories/escrow-repo";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { featuredBusinessesSeed } from "@/data/featured-businesses";
import type { AuthScope } from "@/types/auth";
import type { MerchantWallet } from "@/types/escrow";
import type { FeaturedBusiness } from "@/types/featured-business";
import type { EscrowTransaction } from "@/lib/validations/schemas";
import { getReservationsByBusiness } from "@/data/reservationService";
import type { Reservation } from "@/types/reservation";
import { getTrafficSummary, type TrafficSummary } from "@/lib/analytics/analytics-api";
import type { ConciergeRequest } from "@/lib/actions/concierge";

type DashboardMetric = {
  label: string;
  value: string;
};

type ServiceTypeSummary = {
  label: string;
  value: string;
};

export type AdminDashboardData = {
  metrics: DashboardMetric[];
  serviceTypeSummary: ServiceTypeSummary[];
  topBusinesses: FeaturedBusiness[];
};

export type SuperAdminDashboardData = {
  /** KPIs financieros reales extraídos de Firestore */
  kpis: {
    totalReservations: number;
    totalLeads: number;
    totalHeldAmount: number;
    totalReleasedAmount: number;
    pendingPaymentCount: number;
    paidCount: number;
    completedCount: number;
  };
  /** Últimas reservas (leads) de todos los negocios */
  recentReservations: Reservation[];
  /** Últimas transacciones Escrow globales */
  escrowTransactions: EscrowTransaction[];
  /** Negocios del marketplace */
  businesses: FeaturedBusiness[];
  serviceTypeSummary: ServiceTypeSummary[];
  /** Analítica de GA4 */
  trafficSummary: TrafficSummary;
  /** Solicitudes del conserje de IA */
  conciergeRequests: ConciergeRequest[];
};

export type MerchantDashboardData = {
  metrics: DashboardMetric[];
  businesses: FeaturedBusiness[];
  serviceTypeSummary: ServiceTypeSummary[];
  /** Billetera del comercio con saldos retenidos y disponibles del modelo Escrow */
  wallet: MerchantWallet;
  /** Historial transaccional Escrow real */
  escrowTransactions: EscrowTransaction[];
  /** Reservas de los clientes (Llegadas) */
  reservations: Reservation[];
};

function formatAverageRating(businesses: FeaturedBusiness[]) {
  const ratedBusinesses = businesses.filter((business) => typeof business.rating === "number");

  if (ratedBusinesses.length === 0) {
    return "Sin calificación";
  }

  const totalRating = ratedBusinesses.reduce(
    (accumulator, business) => accumulator + (business.rating ?? 0),
    0,
  );

  return (totalRating / ratedBusinesses.length).toFixed(1);
}

function getServiceTypeSummary(businesses: FeaturedBusiness[]) {
  return Array.from(
    businesses.reduce((summaryMap, business) => {
      summaryMap.set(business.serviceType, (summaryMap.get(business.serviceType) ?? 0) + 1);

      return summaryMap;
    }, new Map<string, number>()),
  ).map(([label, value]) => ({
    label,
    value: String(value),
  }));
}

function hasContactCoverage(business: FeaturedBusiness) {
  return Boolean(
    business.phone &&
      business.whatsapp &&
      business.address &&
      (business.email || business.website || business.mapLink),
  );
}

export function getScopedBusinesses(scope: AuthScope) {
  if (scope.global) {
    return featuredBusinessesSeed;
  }

  return featuredBusinessesSeed.filter((business) => {
    const matchesTenant = scope.tenantId ? business.tenantId === scope.tenantId : true;
    const matchesBusinessIds =
      scope.businessIds.length > 0 ? scope.businessIds.includes(business.id) : true;
    const matchesServiceTypes =
      scope.serviceTypes.length > 0 ? scope.serviceTypes.includes(business.serviceType) : true;

    return matchesTenant && matchesBusinessIds && matchesServiceTypes;
  });
}

export function getAdminDashboardData(): AdminDashboardData {
  const allBusinesses = featuredBusinessesSeed;
  const featuredBusinesses = allBusinesses.filter((business) => business.featured);

  return {
    metrics: [
      { label: "Negocios totales", value: String(allBusinesses.length) },
      { label: "Destacados activos", value: String(featuredBusinesses.length) },
      { label: "Promedio de rating", value: formatAverageRating(allBusinesses) },
      {
        label: "Tenants activos",
        value: String(new Set(allBusinesses.map((business) => business.tenantId)).size),
      },
    ],
    serviceTypeSummary: getServiceTypeSummary(allBusinesses),
    topBusinesses: [...allBusinesses]
      .sort((left, right) => (right.rating ?? 0) - (left.rating ?? 0))
      .slice(0, 4),
  };
}

/** Billetera en cero por defecto cuando el comercio no tiene historial Escrow aún */
function buildEmptyWallet(merchantId: string): MerchantWallet {
  return {
    merchant_id: merchantId,
    available_balance: 0,
    held_balance: 0,
    payout_method: {
      type: "NEQUI",
      account_number: "",
      account_holder_name: "",
      document_id: "",
    },
  };
}

export async function getMerchantDashboardData(scope: AuthScope): Promise<MerchantDashboardData> {
  const businesses = getScopedBusinesses(scope);
  const featuredBusinesses = businesses.filter((business) => business.featured);
  const contactReadyBusinesses = businesses.filter(hasContactCoverage);

  // Usamos el tenantId como merchantId. Si no existe en Firestore, retornamos wallet en cero
  // para no bloquear el dashboard durante el onboarding de nuevos comercios.
  const merchantId = scope.tenantId ?? "unknown";
  
  const walletPromise = EscrowRepo.getMerchantBalance(merchantId).then((w) => ({
    merchant_id: merchantId,
    available_balance: w.available_balance,
    held_balance: w.held_balance,
    payout_method: { type: "NEQUI", account_number: "", account_holder_name: "", document_id: "" } as const
  })).catch(() => buildEmptyWallet(merchantId));
  
  const transactionsPromise = EscrowRepo.getTransactionsByBusiness(merchantId).catch(() => []);

  // Cargar reservas para todos los negocios de este scope
  const reservationsPromises = businesses.map((b) => getReservationsByBusiness(b.id));

  const [wallet, escrowTransactions, ...reservationsArrays] = await Promise.all([
    walletPromise, 
    transactionsPromise,
    ...reservationsPromises
  ]);
  
  const reservations = reservationsArrays
    .flat()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return {
    metrics: [
      { label: "Negocios en tu scope", value: String(businesses.length) },
      { label: "Destacados", value: String(featuredBusinesses.length) },
      { label: "Promedio de rating", value: formatAverageRating(businesses) },
      {
        label: "Fichas con contacto completo",
        value: `${contactReadyBusinesses.length}/${businesses.length || 0}`,
      },
    ],
    businesses,
    serviceTypeSummary: getServiceTypeSummary(businesses),
    wallet,
    escrowTransactions,
    reservations,
  };
}

/**
 * Carga TODOS los leads (reservas) y transacciones Escrow del sistema completo.
 * Solo accesible por el SuperAdmin / Admin.
 */
export async function getAdminDashboardFullData(): Promise<SuperAdminDashboardData> {
  const db = getFirestore(getFirebaseAdminApp());
  const allBusinesses = featuredBusinessesSeed;

  // 1. Reservas globales (todos los negocios)
  const allReservationsPromises = allBusinesses.map(async (b) => {
    try {
      const snap = await db
        .collection("reservations")
        .where("business_id", "==", b.id)
        .get();
      return snap.docs.map((doc) => doc.data() as Reservation);
    } catch {
      return [];
    }
  });

  // 2. Transacciones Escrow globales
  const allEscrowPromise = EscrowRepo.getAllTransactions().catch(() => []);

  // 3. Analítica de GA4
  const trafficPromise = getTrafficSummary();

  // 4. Solicitudes del Conserje
  const conciergePromise = db.collection("concierge_requests").orderBy("createdAt", "desc").limit(20).get()
    .then(snap => snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ConciergeRequest & {id: string}))
    .catch(() => []);

  const [reservationsNested, escrowTransactions, trafficSummary, conciergeRequests] = await Promise.all([
    Promise.all(allReservationsPromises),
    allEscrowPromise,
    trafficPromise,
    conciergePromise,
  ]);

  const recentReservations = reservationsNested
    .flat()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50);

  // 3. KPIs financieros calculados
  const totalHeldAmount = escrowTransactions
    .filter((tx) => tx.status === "held")
    .reduce((sum, tx) => sum + (tx.netAmountToBusiness ?? 0), 0);

  const totalReleasedAmount = escrowTransactions
    .filter((tx) => tx.status === "released")
    .reduce((sum, tx) => sum + (tx.netAmountToBusiness ?? 0), 0);

  const allReservationsFlat = reservationsNested.flat();

  return {
    kpis: {
      totalReservations: allReservationsFlat.length,
      totalLeads: allReservationsFlat.length,
      totalHeldAmount,
      totalReleasedAmount,
      pendingPaymentCount: allReservationsFlat.filter((r) => r.status === "PENDING_PAYMENT").length,
      paidCount: allReservationsFlat.filter((r) => r.status === "PAID").length,
      completedCount: allReservationsFlat.filter((r) => r.status === "COMPLETED").length,
    },
    recentReservations,
    escrowTransactions,
    businesses: allBusinesses,
    serviceTypeSummary: getServiceTypeSummary(allBusinesses),
    trafficSummary,
    conciergeRequests,
  };
}
