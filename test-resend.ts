import fs from "fs";
import path from "path";

// Cargar variables de entorno a mano
const env = fs.readFileSync(path.resolve(".env.local"), "utf8");
env.split("\n").forEach((line) => {
  const [key, ...values] = line.split("=");
  if (key && values.length > 0) {
    process.env[key.trim()] = values.join("=").trim().replace(/^"|"$/g, "");
  }
});

// Dynamic import to ensure process.env is set BEFORE resend.ts is evaluated
async function runTest() {
  console.log("Iniciando prueba de envío de correo...");
  const { sendPreReservationEmail } = await import("./lib/email/resend.js");

  const success = await sendPreReservationEmail({
    customerEmail: "jhonjairogramos@gmail.com",
    customerName: "Jhon Jairo Ramos (Test)",
    itinerary: "Test desde consola - Limpieza de Supresión",
    estimatedPrice: "150000",
    advice: "Test exitoso, las supresiones han sido limpiadas.",
    referenceCode: "TEST-" + Date.now(),
    type: "reservation",
  });

  if (success) {
    console.log("✅ Prueba exitosa. El correo fue enviado y aceptado por Resend.");
  } else {
    console.log("❌ Hubo un fallo en la prueba de envío.");
  }
}

runTest();
