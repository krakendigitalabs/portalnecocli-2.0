/**
 * Servicio de fidelización (Loyalty) para Portal Necoclí.
 * Gestiona el perfil del turista, las estrellas doradas y la generación de bonos.
 *
 * ARQUITECTURA: Usa el Admin SDK de Firebase (server-only) para operar
 * desde API Routes y Server Actions con privilegios de administrador.
 */
import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { BONUS_TEMPLATES } from "@/data/bonusTemplates";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type { LoyaltyBonus, LoyaltyProfile, LoyaltyStar } from "@/types/loyalty";
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
  email: string,
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
export async function getLoyaltyProfile(customerId: string): Promise<LoyaltyProfile | null> {
  const db = getDb();
  const snap = await db.collection("loyalty_profiles").doc(customerId).get();
  if (!snap.exists) return null;
  return snap.data() as LoyaltyProfile;
}

/**
 * Obtiene las últimas estrellas ganadas por un turista (máximo 20).
 */
export async function getLoyaltyStars(customerId: string): Promise<LoyaltyStar[]> {
  try {
    const db = getDb();
    const snap = await db
      .collection("loyalty_stars")
      .where("customer_id", "==", customerId)
      // .orderBy("earned_at", "desc") // Eliminado para evitar composite index en desarrollo
      // .limit(20)
      .get();

    const stars = snap.docs.map((doc) => doc.data() as LoyaltyStar);

    return stars
      .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
      .slice(0, 20);
  } catch (error) {
    console.error("Error obteniendo estrellas:", error);
    return [];
  }
}

/**
 * Otorga una estrella dorada al turista al completar una reserva.
 * Si completa 5 estrellas en el ciclo, genera automáticamente el bono al 50%.
 */
export async function awardLoyaltyStar(params: {
  customerId: string;
  reservationId: string;
  businessName: string;
  businessCategory?: string; // Optional para backwards compatibility
}): Promise<{ star: LoyaltyStar; bonusGenerated: boolean; bonus?: LoyaltyBonus }> {
  const db = getDb();
  const profileRef = db.collection("loyalty_profiles").doc(params.customerId);
  const profileSnap = await profileRef.get();

  let profile: LoyaltyProfile;
  const now = new Date().toISOString();

  if (!profileSnap.exists) {
    // Inicializar perfil en caso de que sea su primera transacción
    profile = {
      customer_id: params.customerId,
      display_name: "Turista (Generado Auto)",
      email: "correo@no-definido.com", // Se actualizará en login
      total_stars: 0,
      stars_in_cycle: 0,
      bonuses_redeemed: 0,
      has_active_bonus: false,
      active_bonus_code: null,
      created_at: now,
      updated_at: now,
    };
    await profileRef.set(profile);
  } else {
    profile = profileSnap.data() as LoyaltyProfile;
  }

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
    // Cross-Selling: Excluir la categoría actual si existe.
    let eligibleTemplates = BONUS_TEMPLATES;
    if (params.businessCategory) {
      eligibleTemplates = BONUS_TEMPLATES.filter(
        (t) => t.target_category !== params.businessCategory,
      );
      // Fallback si por alguna razón no hay otras categorías
      if (eligibleTemplates.length === 0) eligibleTemplates = BONUS_TEMPLATES;
    }

    // Elegir aleatoriamente
    const randomIndex = Math.floor(Math.random() * eligibleTemplates.length);
    const selectedTemplate = eligibleTemplates[randomIndex];

    // Expiración rápida: 7 días
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const bonusRef = db.collection("loyalty_bonuses").doc();
    bonusCode = generateBonusCode();

    bonus = {
      id: bonusRef.id,
      customer_id: params.customerId,
      code: bonusCode,
      ...selectedTemplate,
      status: "ACTIVE",
      created_at: now,
      expires_at: expiresAt.toISOString(),
    } as LoyaltyBonus;

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
  try {
    const db = getDb();
    const snap = await db
      .collection("loyalty_bonuses")
      .where("customer_id", "==", customerId)
      // .orderBy("created_at", "desc") // Eliminado para evitar composite index en desarrollo
      // .limit(10)
      .get();

    const bonuses = snap.docs.map((doc) => doc.data() as LoyaltyBonus);

    return bonuses
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  } catch (error) {
    console.error("Error obteniendo bonos:", error);
    return [];
  }
}
