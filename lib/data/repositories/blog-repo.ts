import "server-only";
import { EDITORIAL_BLOG_POSTS } from "@/data/blog-editorial";
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

function getEditorialPublished(category?: BlogCategory): BlogPost[] {
  return EDITORIAL_BLOG_POSTS.filter(
    (post) => post.status === "published" && (!category || post.category === category),
  );
}

function mergeAndSortPosts(firestorePosts: BlogPost[], editorialPosts: BlogPost[]): BlogPost[] {
  const bySlug = new Map<string, BlogPost>();

  for (const post of editorialPosts) {
    bySlug.set(post.slug, post);
  }
  for (const post of firestorePosts) {
    bySlug.set(post.slug, post);
  }

  return Array.from(bySlug.values()).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export const BlogRepo = {
  async listPublished(category?: BlogCategory): Promise<BlogPost[]> {
    const editorialPosts = getEditorialPublished(category);

    if (!hasFirebaseAdminConfig()) {
      return mergeAndSortPosts([], editorialPosts);
    }

    try {
      let query = getFirebaseAdminFirestore()
        .collection(COLLECTION_NAME)
        .where("status", "==", "published");

      if (category) {
        query = query.where("category", "==", category);
      }

      const snapshot = await query.get();
      const firestorePosts = parsePosts(snapshot.docs);

      return mergeAndSortPosts(firestorePosts, editorialPosts);
    } catch (error) {
      console.error("[blog] Error al listar posts", error);
      return mergeAndSortPosts([], editorialPosts);
    }
  },

  async getPublishedBySlug(slug: string): Promise<BlogPost | null> {
    const parsedSlug = BlogSlugSchema.safeParse(slug);
    if (!parsedSlug.success) return null;

    const editorialMatch =
      EDITORIAL_BLOG_POSTS.find(
        (post) => post.slug === parsedSlug.data && post.status === "published",
      ) ?? null;

    if (!hasFirebaseAdminConfig()) return editorialMatch;

    try {
      const doc = await getFirebaseAdminFirestore()
        .collection(COLLECTION_NAME)
        .doc(parsedSlug.data)
        .get();

      if (!doc.exists) return editorialMatch;

      const result = BlogPostSchema.safeParse({ ...doc.data(), slug: doc.id });
      if (result.success && result.data.status === "published") {
        return result.data;
      }

      return editorialMatch;
    } catch (error) {
      console.error(`[blog] Error al leer el post ${slug}`, error);
      return editorialMatch;
    }
  },
};

export function parseBlogCategory(value: string | undefined): BlogCategory | undefined {
  const result = BlogCategoryFilterSchema.safeParse(value);
  return result.success ? result.data : undefined;
}