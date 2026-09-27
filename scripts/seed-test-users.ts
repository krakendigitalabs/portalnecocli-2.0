import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";

async function run() {
  const db = getFirestore(getFirebaseAdminApp());

  // 1. Crear un conductor de prueba Pendiente
  await db.collection("drivers").doc("test_driver_pending_01").set({
    id: "test_driver_pending_01",
    full_name: "Juan Conductor (Prueba)",
    email: "conductor@prueba.com",
    phone: "3001234567",
    vehicle_type: "motocarro",
    vehicle_plate: "PRB-001",
    status: "pending_approval",
    wallet_balance: 0,
    created_at: new Date().toISOString(),
  });

  // 2. Crear un conductor de prueba Activo
  await db.collection("drivers").doc("test_driver_active_01").set({
    id: "test_driver_active_01",
    full_name: "María Activa (Prueba)",
    email: "maria.activa@prueba.com",
    phone: "3007654321",
    vehicle_type: "moto",
    vehicle_plate: "PRB-002",
    status: "active",
    wallet_balance: 15000,
    created_at: new Date().toISOString(),
  });

  // 3. Crear un conductor de prueba Rechazado
  await db.collection("drivers").doc("test_driver_rejected_01").set({
    id: "test_driver_rejected_01",
    full_name: "Pedro Rechazado (Prueba)",
    email: "pedro.rechazado@prueba.com",
    phone: "3009998888",
    vehicle_type: "taxi",
    vehicle_plate: "PRB-003",
    status: "rejected",
    wallet_balance: 0,
    created_at: new Date().toISOString(),
  });

  console.log("✅ Usuarios de prueba inyectados en la base de datos.");
}

run().catch(console.error);
