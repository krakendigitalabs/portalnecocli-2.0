import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
const BONUS_TEMPLATES = [
  {
    title: "15% OFF en 2da Noche",
    description: "Recibe 15% de descuento en la segunda noche consecutiva.",
    target_category: "hotel",
    type: "DISCOUNT_PERCENTAGE",
    valid_days: [1, 2, 3, 4],
  },
  {
    title: "Postre y Bebida Gratis",
    description: "Por la compra de un plato fuerte, recibe postre y bebida.",
    target_category: "restaurant",
    type: "FREE_ITEM",
    valid_days: [],
  },
  {
    title: "2x1 en Volcán de Lodo",
    description: "Compra un tiquete y tu acompañante entra gratis.",
    target_category: "tour",
    type: "SPECIAL_PERK",
    valid_days: [2, 3],
  },
  {
    title: "10% OFF en Marca Aliada",
    description: "Descuento directo en herramientas y materiales seleccionados.",
    target_category: "hardware",
    type: "DISCOUNT_PERCENTAGE",
    valid_days: [1, 2, 3, 4],
  },
  {
    title: "Valoración Gratis + 50% Profilaxis",
    description: "Chequeo completo y limpieza a mitad de precio.",
    target_category: "health",
    type: "SPECIAL_PERK",
    valid_days: [1, 2, 3, 4],
  }
];

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
    console.log(`Replacing old bonuses for user: ${user.uid}`);

    const snap = await db.collection("loyalty_bonuses").where("customer_id", "==", user.uid).get();
    
    let count = 0;
    const batch = db.batch();
    
    snap.docs.forEach(doc => {
      const data = doc.data();
      // Si no tiene title, es un bono antiguo.
      if (!data.title) {
        const randomIndex = Math.floor(Math.random() * BONUS_TEMPLATES.length);
        const template = BONUS_TEMPLATES[randomIndex];
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        
        batch.update(doc.ref, {
          title: template.title,
          description: template.description,
          target_category: template.target_category,
          type: template.type,
          value: template.value || null,
          valid_days: template.valid_days,
          expires_at: expiresAt.toISOString(),
          discount_percentage: FieldValue.delete()
        });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`Successfully upgraded ${count} old bonuses to the new dynamic format.`);
    } else {
      console.log(`No old bonuses found to upgrade.`);
    }

  } catch (err) {
    console.error("Error:", err);
  }
}

run();
