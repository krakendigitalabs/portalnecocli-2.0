import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

/** Genera el código único de un bono al 50% */
function generateBonusCode() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BONO-NEC-${year}-${random}`;
}

async function run() {
  const auth = getAuth();
  const db = getFirestore();

  try {
    const user = await auth.getUserByEmail("krakendigitalabs@gmail.com");
    console.log(`Syncing bonuses for user: ${user.uid}`);

    // Fetch user's reservations
    const reservationsSnap = await db.collection("reservations").where("customer_id", "==", user.uid).get();
    
    // Fetch existing stars to prevent duplicates
    const starsSnap = await db.collection("loyalty_stars").where("customer_id", "==", user.uid).get();
    const existingStarReservationIds = new Set(starsSnap.docs.map(doc => doc.data().reservation_id));

    let newStarsCount = 0;
    
    // We only process reservations that are valid (e.g. PAID or COMPLETED, but we'll process all for this patch to simulate)
    for (const doc of reservationsSnap.docs) {
      if (existingStarReservationIds.has(doc.id)) continue;
      
      const reservation = doc.data();
      const params = {
        customerId: user.uid,
        reservationId: doc.id,
        businessName: reservation.business_name || "Negocio Desconocido"
      };

      // Inline awardLoyaltyStar logic to avoid module resolution issues in vanilla Node script
      const profileRef = db.collection("loyalty_profiles").doc(params.customerId);
      const profileSnap = await profileRef.get();
      let profile;
      const now = new Date().toISOString();

      if (!profileSnap.exists) {
        profile = {
          customer_id: params.customerId,
          display_name: "Turista (Migración)",
          email: user.email,
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
        profile = profileSnap.data();
      }

      const starRef = db.collection("loyalty_stars").doc();
      const star = {
        id: starRef.id,
        customer_id: params.customerId,
        reservation_id: params.reservationId,
        business_name: params.businessName,
        earned_at: now,
      };
      await starRef.set(star);

      const newStarsInCycle = profile.stars_in_cycle + 1;
      const newTotalStars = profile.total_stars + 1;
      const cycleCompleted = newStarsInCycle >= 5; // LOYALTY_STARS_PER_CYCLE = 5

      let bonusCode = profile.active_bonus_code;
      let hasActiveBonus = profile.has_active_bonus;

      if (cycleCompleted) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 6);
        const bonusRef = db.collection("loyalty_bonuses").doc();
        bonusCode = generateBonusCode();
        const bonus = {
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
        console.log(`Generated BONUS: ${bonusCode}`);
      }

      await profileRef.update({
        total_stars: newTotalStars,
        stars_in_cycle: cycleCompleted ? 0 : newStarsInCycle,
        has_active_bonus: hasActiveBonus,
        active_bonus_code: bonusCode,
        updated_at: now,
      });

      newStarsCount++;
    }

    console.log(`Successfully generated ${newStarsCount} stars.`);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
