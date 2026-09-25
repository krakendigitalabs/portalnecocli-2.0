/**
 * Script de asignación de roles — Portal Necoclí 2.0
 * Ejecutar con: node scripts/set-admin-roles.mjs
 *
 * Asigna Custom Claims de Firebase Auth para habilitar acceso al Panel SuperAdmin.
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Cargar variables de entorno desde .env.local
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");

function parseEnv(content) {
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    // Quitar comillas
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Reemplazar \n literales por saltos de línea reales
    val = val.replace(/\\n/g, "\n");
    vars[key] = val;
  }
  return vars;
}

const env = parseEnv(envContent);

// Inicializar Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
  }),
});

const auth = getAuth(app);

// ─────────────────────────────────────────────
//  CONFIGURACIÓN DE ROLES
// ─────────────────────────────────────────────

const USERS_TO_CONFIGURE = [
  {
    email: "krakendigitalabs@gmail.com",
    role: "super_admin",
    description: "🔱 Propietario / La Matrix — Kraken Digital Labs",
  },
  {
    email: "portalnecocli@gmail.com",
    role: "admin",
    description: "🛡️ Administrador del Portal Necoclí",
  },
];

// ─────────────────────────────────────────────
//  EJECUCIÓN
// ─────────────────────────────────────────────

async function assignRole(config) {
  console.log(`\n📋 Procesando: ${config.description}`);
  console.log(`   Email: ${config.email} → rol: ${config.role}`);

  try {
    // Buscar el usuario por email
    const user = await auth.getUserByEmail(config.email);
    console.log(`   ✅ Usuario encontrado: UID = ${user.uid}`);

    // Asignar el Custom Claim del rol
    await auth.setCustomUserClaims(user.uid, {
      role: config.role,
      roles: [config.role],
    });

    console.log(`   🎯 Rol "${config.role}" asignado exitosamente.`);
    console.log(
      `   ⚠️  El usuario debe cerrar sesión y volver a iniciarla para que el token se actualice.`,
    );

    // Verificar que los claims quedaron bien
    const updatedUser = await auth.getUser(user.uid);
    console.log(`   🔍 Claims actuales:`, JSON.stringify(updatedUser.customClaims, null, 2));

    return { success: true, uid: user.uid, email: config.email, role: config.role };
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      console.error(
        `   ❌ ERROR: Usuario con email "${config.email}" no encontrado en Firebase Auth.`,
      );
      console.error(`      Asegúrate de que se haya registrado primero en el portal.`);
    } else {
      console.error(`   ❌ ERROR inesperado:`, error.message);
    }
    return { success: false, email: config.email, error: error.message };
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  🧠 PORTAL NECOCLÍ — Asignación de Roles SuperAdmin");
  console.log("  🏴‍☠️ Kraken Digital Labs — Script de Administración");
  console.log("═══════════════════════════════════════════════════════");

  const results = [];

  for (const config of USERS_TO_CONFIGURE) {
    const result = await assignRole(config);
    results.push(result);
  }

  console.log("\n\n══════════════ RESUMEN FINAL ══════════════");
  for (const r of results) {
    if (r.success) {
      console.log(`✅ ${r.email} → ${r.role} → UID: ${r.uid}`);
    } else {
      console.log(`❌ ${r.email} → ERROR: ${r.error}`);
    }
  }

  console.log("\n📌 PRÓXIMOS PASOS:");
  console.log("   1. Ambos usuarios deben cerrar sesión en el portal.");
  console.log("   2. Volver a iniciar sesión para refrescar el token.");
  console.log("   3. Acceder a https://portal-necocli.vercel.app/admin");
  console.log("═══════════════════════════════════════════════════════\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
