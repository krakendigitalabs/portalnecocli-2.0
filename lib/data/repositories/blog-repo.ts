import "server-only";
import { getFirebaseAdminFirestore, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import {
  BlogCategoryFilterSchema,
  BlogPostSchema,
  BlogSlugSchema,
} from "@/lib/validations/blog.schema";
import type { BlogCategory, BlogPost } from "@/types/blog";

const COLLECTION_NAME = "blog_posts";

function parsePosts(docs: FirebaseFirestore.QueryDocumentSnapshot[]): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const doc of docs) {
    const result = BlogPostSchema.safeParse({ ...doc.data(), slug: doc.id });
    if (result.success) {
      posts.push(result.data);
    } else {
      console.error(`[blog] Documento inválido omitido: ${doc.id}`, result.error.flatten());
    }
  }

  return posts;
}

export const BlogRepo = {
  /** Lista posts publicados (más recientes primero), con filtro opcional por categoría. */
  async listPublished(category?: BlogCategory): Promise<BlogPost[]> {
    if (!hasFirebaseAdminConfig()) return [];

    try {
      let query = getFirebaseAdminFirestore()
        .collection(COLLECTION_NAME)
        .where("status", "==", "published");

      if (category) {
        query = query.where("category", "==", category);
      }

      const snapshot = await query.get();

      // Orden en memoria: evita requerir un índice compuesto en Firestore.
      return parsePosts(snapshot.docs).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    } catch (error) {
      console.error("[blog] Error al listar posts", error);
      return [];
    }
  },

  /** Obtiene un post publicado por slug (ID del documento). */
  async getPublishedBySlug(slug: string): Promise<BlogPost | null> {
    const parsedSlug = BlogSlugSchema.safeParse(slug);
    if (!parsedSlug.success || !hasFirebaseAdminConfig()) return null;

    try {
      const doc = await getFirebaseAdminFirestore()
        .collection(COLLECTION_NAME)
        .doc(parsedSlug.data)
        .get();

      if (!doc.exists) return null;

      const result = BlogPostSchema.safeParse({ ...doc.data(), slug: doc.id });
      return result.success && result.data.status === "published" ? result.data : null;
    } catch (error) {
      console.error(`[blog] Error al leer el post ${slug}`, error);
      return null;
    }
  },
};

export function parseBlogCategory(value: string | undefined): BlogCategory | undefined {
  const result = BlogCategoryFilterSchema.safeParse(value);
  return result.success ? result.data : undefined;
}
