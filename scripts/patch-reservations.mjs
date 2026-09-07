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

async function run() {
  const auth = getAuth();
  const db = getFirestore();

  try {
    const user = await auth.getUserByEmail("krakendigitalabs@gmail.com");
    console.log(`Found user: ${user.uid}`);

    const snap = await db.collection("reservations").get();
    let updated = 0;

    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data.customer_id) {
        await doc.ref.update({ customer_id: user.uid });
        console.log(`Updated reservation ${doc.id} with customer_id ${user.uid}`);
        updated++;
      }
    }
    
    console.log(`Successfully updated ${updated} reservations.`);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
