import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { BLOG_SEED_POSTS } from "@/data/blog-seed";
import { BlogPostSchema } from "@/lib/validations/blog.schema";

// Uso: npx tsx --env-file=.env.local scripts/seed-blog.ts
const WORDS_PER_MINUTE = 200;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

async function run() {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    "";
  if (!projectId) throw new Error("Falta FIREBASE_ADMIN_PROJECT_ID");

  if (getApps().length === 0) {
    initializeApp({
      projectId,
      credential: cert({
        projectId,
        clientEmail: requireEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
        privateKey: requireEnv("FIREBASE_ADMIN_PRIVATE_KEY")
          .replace(/^"|"$/g, "")
          .replace(/\\n/g, "\n"),
      }),
    });
  }

  const db = getFirestore();
  const now = new Date().toISOString();

  for (const seed of BLOG_SEED_POSTS) {
    const parsed = BlogPostSchema.parse({
      ...seed,
      readingTimeMinutes: estimateReadingTime(seed.content),
      updatedAt: now,
    });

    const ref = db.collection("blog_posts").doc(parsed.slug);
    const existing = await ref.get();

    // Se guardan como Date para que Firestore los persista como Timestamp.
    await ref.set({
      ...parsed,
      publishedAt: new Date(parsed.publishedAt),
      updatedAt: new Date(parsed.updatedAt),
    });

    console.log(`${existing.exists ? "Actualizado" : "Creado"}: blog_posts/${parsed.slug}`);
  }
}

run().catch((error: unknown) => {
  console.error("Seed fallido:", error);
  process.exit(1);
});
