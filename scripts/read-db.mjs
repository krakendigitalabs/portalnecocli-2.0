import fs from "fs";
import path from "path";

const envPath = path.resolve(".env.local");
const envFile = fs.readFileSync(envPath, "utf8");
envFile.split("\n").forEach((line) => {
  const [k, ...v] = line.split("=");
  if (k && v.length) {
    process.env[k.trim()] = v.join("=").trim().replace(/^"|"$/g, "");
  }
});

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  let credential;
  try {
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      credential = cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
    }
  } catch (e) {
    console.error("Error cargando cert:", e);
  }

  initializeApp({
    credential,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore();

async function run() {
  console.log("Buscando yessyalh@gmail.com...");
  const snap = await db.collection("concierge_requests").get();
  let found = false;
  snap.forEach((doc) => {
    const data = doc.data();
    if (
      data.email === "yessyalh@gmail.com" ||
      data.name === "alejandro" ||
      data.name?.toLowerCase().includes("alejandro")
    ) {
      console.log("ID:", doc.id);
      console.log(" - Email:", data.email);
      console.log(" - Phone:", data.phone);
      console.log(" - Name:", data.name);
      console.log(" - Created:", data.createdAt?.toDate());
      console.log("---");
      found = true;
    }
  });
  if (!found) console.log("No se encontró ninguna reserva para yessyalh@gmail.com o alejandro");
}

run().catch(console.error);
