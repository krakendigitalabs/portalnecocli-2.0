import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// Uso: node scripts/update-blog-post.mjs <slug> [--title "..."] [--cover https://...] [--alt "..."]
// Actualiza un post de la colección blog_posts usando el Admin SDK (credenciales en .env.local).

const envPath = path.resolve(".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const [key, ...value] = line.split("=");
    if (key && value.length) {
      process.env[key.trim()] = value.join("=").trim().replace(/^"|"$/g, "");
    }
  }
}

const [slug, ...rest] = process.argv.slice(2);
if (!slug) {
  console.error(
    'Uso: node scripts/update-blog-post.mjs <slug> [--title "..."] [--cover URL] [--alt "..."]',
  );
  process.exit(1);
}

const flags = { "--title": "title", "--cover": "coverImageUrl", "--alt": "coverImageAlt" };
const updates = {};
for (let i = 0; i < rest.length; i += 2) {
  const field = flags[rest[i]];
  if (!field || rest[i + 1] === undefined) {
    console.error(`Argumento no válido: ${rest[i]}`);
    process.exit(1);
  }
  updates[field] = rest[i + 1];
}
if (Object.keys(updates).length === 0) {
  console.error("Nada que actualizar.");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    }),
  });
}

const ref = getFirestore().collection("blog_posts").doc(slug);
const snapshot = await ref.get();
if (!snapshot.exists) {
  console.error(`No existe blog_posts/${slug}`);
  process.exit(1);
}

await ref.update({ ...updates, updatedAt: Timestamp.now() });
console.log(`Post ${slug} actualizado:`, updates);
