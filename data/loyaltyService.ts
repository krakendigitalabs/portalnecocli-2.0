/**
 * Servicio de fidelización (Loyalty) para Portal Necoclí.
 * Gestiona el perfil del turista, las estrellas doradas y la generación de bonos.
 * 
 * ARQUITECTURA: Usa el Admin SDK de Firebase (server-only) para operar
 * desde API Routes y Server Actions con privilegios de administrador.
 */
import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type {
  LoyaltyProfile,
  LoyaltyStar,
  LoyaltyBonus,
} from "@/types/loyalty";
import { LOYALTY_STARS_PER_CYCLE } from "@/types/loyalty";

function getDb() {
  return getFirestore(getFirebaseAdminApp());
}

/** Genera el código único de un bono al 50% */
function generateBonusCode(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BONO-NEC-${year}-${random}`;
}

/**
 * Obtiene o crea el perfil de fidelización de un turista.
 * Si no existe, lo inicializa con 0 estrellas.
 */
export async function getOrCreateLoyaltyProfile(
  customerId: string,
  displayName: string,
  email: string
): Promise<LoyaltyProfile> {
  const db = getDb();
  const ref = db.collection("loyalty_profiles").doc(customerId);
  const snap = await ref.get();

  if (snap.exists) {
    return snap.data() as LoyaltyProfile;
  }

  const now = new Date().toISOString();
  const profile: LoyaltyProfile = {
    customer_id: customerId,
    display_name: displayName,
    email,
    total_stars: 0,
    stars_in_cycle: 0,
    bonuses_redeemed: 0,
    has_active_bonus: false,
    active_bonus_code: null,
    created_at: now,
    updated_at: now,
  };

  await ref.set(profile);
  return profile;
}

/**
 * Obtiene el perfil de fidelización de un turista por su UID.
 */
export async function getLoyaltyProfile(
  customerId: string
): Promise<LoyaltyProfile | null> {
  const db = getDb();
  const snap = await db.collection("loyalty_profiles").doc(customerId).get();
  if (!snap.exists) return null;
  return snap.data() as LoyaltyProfile;
}

/**
 * Obtiene las últimas estrellas ganadas por un turista (máximo 20).
 */
export async function getLoyaltyStars(customerId: string): Promise<LoyaltyStar[]> {
  const db = getDb();
  const snap = await db
    .collection("loyalty_stars")
    .where("customer_id", "==", customerId)
    .orderBy("earned_at", "desc")
    .limit(20)
    .get();

  return snap.docs.map((doc) => doc.data() as LoyaltyStar);
}

/**
 * Otorga una estrella dorada al turista al completar una reserva.
 * Si completa 5 estrellas en el ciclo, genera automáticamente el bono al 50%.
 */
export async function awardLoyaltyStar(params: {
  customerId: string;
  reservationId: string;
  businessName: string;
}): Promise<{ star: LoyaltyStar; bonusGenerated: boolean; bonus?: LoyaltyBonus }> {
  const db = getDb();
  const profileRef = db.collection("loyalty_profiles").doc(params.customerId);
  const profileSnap = await profileRef.get();

  if (!profileSnap.exists) {
    throw new Error(`Perfil de fidelización no encontrado para ${params.customerId}`);
  }

  const profile = profileSnap.data() as LoyaltyProfile;
  const now = new Date().toISOString();

  // Crear la estrella
  const starRef = db.collection("loyalty_stars").doc();
  const star: LoyaltyStar = {
    id: starRef.id,
    customer_id: params.customerId,
    reservation_id: params.reservationId,
    business_name: params.businessName,
    earned_at: now,
  };
  await starRef.set(star);

  const newStarsInCycle = profile.stars_in_cycle + 1;
  const newTotalStars = profile.total_stars + 1;
  const cycleCompleted = newStarsInCycle >= LOYALTY_STARS_PER_CYCLE;

  let bonus: LoyaltyBonus | undefined;
  let bonusCode: string | null = profile.active_bonus_code;
  let hasActiveBonus = profile.has_active_bonus;

  if (cycleCompleted) {
    // Generar bono al 50%: válido por 6 meses
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 6);
    const bonusRef = db.collection("loyalty_bonuses").doc();
    bonusCode = generateBonusCode();
    bonus = {
      id: bonusRef.id,
      customer_id: params.customerId,
      code: bonusCode,
      discount_percentage: 50,
      status: "ACTIVE",
      created_at: now,
      expires_at: expiresAt.toISOString(),
    };
    await bonusRef.set(bonus);
    hasActiveBonus = true;
  }

  // Actualizar perfil
  await profileRef.update({
    total_stars: newTotalStars,
    stars_in_cycle: cycleCompleted ? 0 : newStarsInCycle,
    has_active_bonus: hasActiveBonus,
    active_bonus_code: bonusCode,
    updated_at: now,
  });

  return { star, bonusGenerated: cycleCompleted, bonus };
}

/**
 * Obtiene los bonos disponibles y el historial de un turista.
 */
export async function getLoyaltyBonuses(customerId: string): Promise<LoyaltyBonus[]> {
  const db = getDb();
  const snap = await db
    .collection("loyalty_bonuses")
    .where("customer_id", "==", customerId)
    .orderBy("created_at", "desc")
    .limit(10)
    .get();

  return snap.docs.map((doc) => doc.data() as LoyaltyBonus);
}
