import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";

async function checkRecentRequests() {
  const db = getFirestore(getFirebaseAdminApp());
  const snap = await db
    .collection("concierge_requests")
    .orderBy("createdAt", "desc")
    .limit(3)
    .get();

  if (snap.empty) {
    console.log("No hay solicitudes recientes.");
    return;
  }

  snap.forEach((doc) => {
    console.log("---");
    console.log("ID:", doc.id);
    console.log("Data:", doc.data());
  });
}

checkRecentRequests().catch(console.error);
