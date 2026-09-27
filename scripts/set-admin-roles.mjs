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
//  CONFIGURACIÓN DE ROLES — Portal Necoclí 2.0
// ─────────────────────────────────────────────

const USERS_TO_CONFIGURE = [
  {
    email: "krakendigitalabs@gmail.com",
    roles: ["super_admin"],
    scope: { global: true, tenantId: null, businessIds: [], serviceTypes: [] },
    description: "🔱 SuperAdmin / Propietario — Kraken Digital Labs",
  },
  {
    email: "portalnecocli@gmail.com",
    roles: ["business"],
    scope: { global: false, tenantId: "portal-necocli", businessIds: [], serviceTypes: [] },
    description: "🏪 Comercio Aliado — Portal Necoclí (cuenta de prueba)",
  },
  {
    email: "yessyalh@gmail.com",
    roles: ["customer"],
    scope: { global: false, tenantId: null, businessIds: [], serviceTypes: [] },
    description: "🌴 Turista — Cuenta de prueba (Yessy)",
  },
];

// ─────────────────────────────────────────────
//  EJECUCIÓN
// ─────────────────────────────────────────────

async function assignRole(config) {
  console.log(`\n📋 Procesando: ${config.description}`);
  console.log(`   Email: ${config.email} → roles: ${config.roles.join(", ")}`);

  try {
    const user = await auth.getUserByEmail(config.email);
    console.log(`   ✅ Usuario encontrado: UID = ${user.uid}`);

    // Custom Claims: role (string principal) + roles (array) + scope
    await auth.setCustomUserClaims(user.uid, {
      role: config.roles[0],
      roles: config.roles,
      scope: config.scope,
    });

    console.log(`   🎯 Roles asignados: ${config.roles.join(", ")}`);
    console.log(`   ⚠️  Debe cerrar sesión y volver a iniciar para actualizar el token.`);

    const updatedUser = await auth.getUser(user.uid);
    console.log(`   🔍 Claims actuales:`, JSON.stringify(updatedUser.customClaims, null, 2));

    return { success: true, uid: user.uid, email: config.email, roles: config.roles };
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      console.error(`   ❌ ERROR: "${config.email}" no encontrado en Firebase Auth.`);
      console.error(`      Asegúrate de que se haya registrado primero en el portal.`);
    } else {
      console.error(`   ❌ ERROR inesperado:`, error.message);
    }
    return { success: false, email: config.email, error: error.message };
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  🏴‍☠️  PORTAL NECOCLÍ — Asignación de Roles de Prueba");
  console.log("  🦑  Kraken Digital Labs — Script de Administración");
  console.log("═══════════════════════════════════════════════════════");

  const results = [];

  for (const config of USERS_TO_CONFIGURE) {
    const result = await assignRole(config);
    results.push(result);
  }

  console.log("\n\n══════════════ RESUMEN FINAL ══════════════");
  for (const r of results) {
    if (r.success) {
      console.log(`✅ ${r.email} → ${r.roles.join(", ")} → UID: ${r.uid}`);
    } else {
      console.log(`❌ ${r.email} → ERROR: ${r.error}`);
    }
  }

  console.log("\n📌 PRÓXIMOS PASOS:");
  console.log("   1. Los 3 usuarios deben cerrar sesión en el portal.");
  console.log("   2. Volver a iniciar sesión para refrescar el token JWT.");
  console.log("   3. Rutas de acceso:");
  console.log("      🔱 SuperAdmin  → /admin");
  console.log("      🏪 Comercio    → /merchant");
  console.log("      🌴 Turista     → /customer");
  console.log("═══════════════════════════════════════════════════════\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
